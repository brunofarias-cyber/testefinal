import express from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, OAuthToken } from '../models/index.js';
import { encryptToken } from '../utils/oauthCrypto.js';

const router = express.Router();

function getCookie(name, cookieHeader = '') {
    return cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${name}=`))
        ?.split('=')[1];
}

function buildJwt(user) {
    return jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function buildRedirect(url) {
    return process.env.VITE_API_URL ? `${process.env.VITE_API_URL}${url}` : `http://localhost:${process.env.PORT || 3000}${url}`;
}

// ========== GOOGLE ==========
function getGoogleClient() {
    const missing = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL'].filter((k) => !process.env[k]);
    if (missing.length) throw new Error(`Variáveis ausentes: ${missing.join(', ')}`);
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );
}

router.get('/auth/google', (req, res) => {
    try {
        const client = getGoogleClient();
        const scopes = [
            'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
            'https://www.googleapis.com/auth/classroom.courses.readonly',
            'https://www.googleapis.com/auth/classroom.coursework.me',
            'https://www.googleapis.com/auth/classroom.rosters.readonly',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ];
        const url = client.generateAuthUrl({ access_type: 'offline', scope: scopes, prompt: 'consent' });
        res.redirect(url);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.status(400).json({ error: 'Código ausente' });

        const client = getGoogleClient();
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const { data: profile } = await oauth2.userinfo.get();
        const email = profile?.email;
        if (!email) throw new Error('Email não retornado pelo Google');

        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({
                email,
                name: profile.name || email,
                password: crypto.randomBytes(12).toString('hex'),
                role: 'student',
                avatar: profile.picture || null
            });
        }

        await OAuthToken.upsert({
            userId: user.id,
            provider: 'google',
            accessToken: encryptToken(tokens.access_token),
            refreshToken: tokens.refresh_token ? encryptToken(tokens.refresh_token) : null,
            expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null
        });

        const jwtToken = buildJwt(user);
        res.redirect(`${buildRedirect('/auth-success')}?token=${jwtToken}`);
    } catch (err) {
        console.error('Google OAuth error', err);
        res.redirect(`${buildRedirect('/auth-error')}?message=${encodeURIComponent(err.message)}`);
    }
});

// ========== MICROSOFT ==========
function buildMicrosoftAuthUrl(state) {
    const missing = ['MICROSOFT_CLIENT_ID', 'MICROSOFT_CALLBACK_URL', 'MICROSOFT_TENANT_ID'].filter((k) => !process.env[k]);
    if (missing.length) throw new Error(`Variáveis ausentes: ${missing.join(', ')}`);
    const params = new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.MICROSOFT_CALLBACK_URL,
        response_mode: 'query',
        scope: 'User.Read offline_access Files.ReadWrite.All Team.ReadBasic.All',
        state
    });
    return `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?${params.toString()}`;
}

router.get('/auth/microsoft', (req, res) => {
    try {
        const state = crypto.randomBytes(16).toString('hex');
        res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`);
        const url = buildMicrosoftAuthUrl(state);
        res.redirect(url);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/auth/microsoft/callback', async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code) return res.status(400).json({ error: 'Código ausente' });
        const cookieState = getCookie('oauth_state', req.headers.cookie || '');
        if (!state || !cookieState || state !== cookieState) throw new Error('Estado inválido');

        const tokenRes = await fetch(`https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.MICROSOFT_CLIENT_ID,
                client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                code,
                redirect_uri: process.env.MICROSOFT_CALLBACK_URL,
                grant_type: 'authorization_code'
            })
        });

        if (!tokenRes.ok) throw new Error('Falha ao trocar código por token');
        const tokenJson = await tokenRes.json();
        const accessToken = tokenJson.access_token;
        const refreshToken = tokenJson.refresh_token || null;

        const meRes = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!meRes.ok) throw new Error('Falha ao buscar perfil Microsoft');
        const me = await meRes.json();
        const email = me.mail || me.userPrincipalName;
        if (!email) throw new Error('Email não retornado pelo Microsoft Graph');

        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({
                email,
                name: me.displayName || email,
                password: crypto.randomBytes(12).toString('hex'),
                role: 'student'
            });
        }

        const expiresAt = tokenJson.expires_in ? new Date(Date.now() + tokenJson.expires_in * 1000) : null;
        await OAuthToken.upsert({
            userId: user.id,
            provider: 'microsoft',
            accessToken: encryptToken(accessToken),
            refreshToken: refreshToken ? encryptToken(refreshToken) : null,
            expiresAt
        });

        const jwtToken = buildJwt(user);
        res.redirect(`${buildRedirect('/auth-success')}?token=${jwtToken}`);
    } catch (err) {
        console.error('Microsoft OAuth error', err);
        res.redirect(`${buildRedirect('/auth-error')}?message=${encodeURIComponent(err.message)}`);
    }
});

export default router;
