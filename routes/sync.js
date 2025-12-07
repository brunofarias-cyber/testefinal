import express from 'express';
import { google } from 'googleapis';
import { OAuthToken, User } from '../models/index.js';
import { decryptToken, encryptToken } from '../utils/oauthCrypto.js';
import { verifyToken } from '../middleware/auth.js';
import { syncClassrooms, syncAssignments, syncSubmissions } from '../services/googleClassroomService.js';

const router = express.Router();

const GOOGLE_REQUIRED_ENV = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL'];
const MICROSOFT_REQUIRED_ENV = ['MICROSOFT_CLIENT_ID', 'MICROSOFT_CLIENT_SECRET', 'MICROSOFT_TENANT_ID', 'MICROSOFT_CALLBACK_URL'];

function assertEnv(keys) {
    const missing = keys.filter((k) => !process.env[k]);
    if (missing.length) {
        throw new Error(`Variáveis ausentes: ${missing.join(', ')}`);
    }
}

function isExpired(expiresAt) {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() - 60000 <= Date.now(); // 1 min de folga
}

async function getTokenRecord(userId, provider) {
    return OAuthToken.findOne({ where: { userId, provider } });
}

function buildGoogleClient() {
    assertEnv(GOOGLE_REQUIRED_ENV);
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );
}

async function ensureGoogleCredentials(tokenRow) {
    const refreshToken = tokenRow.refreshToken ? decryptToken(tokenRow.refreshToken) : null;
    const accessToken = decryptToken(tokenRow.accessToken);
    const client = buildGoogleClient();

    const baseCredentials = {
        access_token: accessToken,
        refresh_token: refreshToken || undefined,
        expiry_date: tokenRow.expiresAt ? new Date(tokenRow.expiresAt).getTime() : undefined
    };

    client.setCredentials(baseCredentials);

    if (!isExpired(tokenRow.expiresAt) || !refreshToken) {
        return { client, accessToken };
    }

    // Atualiza access token usando refresh_token
    const { credentials } = await client.refreshAccessToken();
    const newAccess = credentials.access_token || accessToken;
    const newRefresh = credentials.refresh_token || refreshToken;
    const newExpiry = credentials.expiry_date ? new Date(credentials.expiry_date) : null;

    await tokenRow.update({
        accessToken: encryptToken(newAccess),
        refreshToken: newRefresh ? encryptToken(newRefresh) : null,
        expiresAt: newExpiry
    });

    client.setCredentials({
        access_token: newAccess,
        refresh_token: newRefresh,
        expiry_date: newExpiry ? newExpiry.getTime() : undefined
    });

    return { client, accessToken: newAccess };
}

async function refreshMicrosoftToken(tokenRow) {
    const refreshToken = tokenRow.refreshToken ? decryptToken(tokenRow.refreshToken) : null;
    if (!refreshToken) return null;

    assertEnv(MICROSOFT_REQUIRED_ENV);

    const res = await fetch(`https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.MICROSOFT_CLIENT_ID,
            client_secret: process.env.MICROSOFT_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            redirect_uri: process.env.MICROSOFT_CALLBACK_URL
        })
    });

    if (!res.ok) return null;

    const tokens = await res.json();
    const newAccess = tokens.access_token;
    const newRefresh = tokens.refresh_token || refreshToken;
    const newExpiry = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

    await tokenRow.update({
        accessToken: encryptToken(newAccess),
        refreshToken: newRefresh ? encryptToken(newRefresh) : null,
        expiresAt: newExpiry
    });

    return { accessToken: newAccess };
}

async function ensureMicrosoftAccessToken(tokenRow) {
    const accessToken = decryptToken(tokenRow.accessToken);
    if (!isExpired(tokenRow.expiresAt)) {
        return accessToken;
    }

    const refreshed = await refreshMicrosoftToken(tokenRow);
    return refreshed?.accessToken || accessToken;
}

router.post('/sync/classroom', verifyToken, async (req, res) => {
    try {
        const tokenRow = await getTokenRecord(req.user.id, 'google');
        if (!tokenRow) {
            return res.status(400).json({ success: false, error: 'Conta Google não conectada' });
        }

        const { client } = await ensureGoogleCredentials(tokenRow);
        const classroom = google.classroom({ version: 'v1', auth: client });
        const coursesRes = await classroom.courses.list({ pageSize: 20 });
        const courses = (coursesRes.data.courses || []).map((c) => ({
            id: c.id,
            name: c.name,
            section: c.section,
            room: c.room,
            description: c.description,
            link: c.alternateLink,
            state: c.courseState
        }));

        await User.update({ lastSyncAt: new Date() }, { where: { id: req.user.id } });

        res.status(200).json({
            success: true,
            provider: 'google_classroom',
            courseCount: courses.length,
            courses
        });
    } catch (err) {
        console.error('Erro sync Classroom', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/sync/classroom/roster', verifyToken, async (req, res) => {
    try {
        const tokenRow = await getTokenRecord(req.user.id, 'google');
        if (!tokenRow) {
            return res.status(400).json({ success: false, error: 'Conta Google não conectada' });
        }

        const refreshToken = tokenRow.refreshToken ? decryptToken(tokenRow.refreshToken) : null;
        if (!refreshToken) {
            return res.status(400).json({ success: false, error: 'Conta Google sem refresh token' });
        }

        const classes = await syncClassrooms(req.user.id, refreshToken);
        await User.update({ lastSyncAt: new Date() }, { where: { id: req.user.id } });

        res.status(200).json({ success: true, provider: 'google_classroom', courseCount: classes.length, classes });
    } catch (err) {
        console.error('Erro sync roster', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/sync/classroom/assignments', verifyToken, async (req, res) => {
    try {
        const { courseId, projectId } = req.body;
        if (!courseId || !projectId) {
            return res.status(400).json({ success: false, error: 'courseId e projectId são obrigatórios' });
        }

        const tokenRow = await getTokenRecord(req.user.id, 'google');
        if (!tokenRow) {
            return res.status(400).json({ success: false, error: 'Conta Google não conectada' });
        }

        const { client } = await ensureGoogleCredentials(tokenRow);
        await syncAssignments(client, courseId, projectId);
        await User.update({ lastSyncAt: new Date() }, { where: { id: req.user.id } });

        res.status(200).json({ success: true, message: 'Tarefas sincronizadas' });
    } catch (err) {
        console.error('Erro sync assignments', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/sync/classroom/submissions', verifyToken, async (req, res) => {
    try {
        const { courseId, courseWorkId, projectId } = req.body;
        if (!courseId || !courseWorkId || !projectId) {
            return res.status(400).json({ success: false, error: 'courseId, courseWorkId e projectId são obrigatórios' });
        }

        const tokenRow = await getTokenRecord(req.user.id, 'google');
        if (!tokenRow) {
            return res.status(400).json({ success: false, error: 'Conta Google não conectada' });
        }

        const { client } = await ensureGoogleCredentials(tokenRow);
        await syncSubmissions(client, courseId, courseWorkId, projectId);
        await User.update({ lastSyncAt: new Date() }, { where: { id: req.user.id } });

        res.status(200).json({ success: true, message: 'Envios sincronizados' });
    } catch (err) {
        console.error('Erro sync submissions', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/sync/teams', verifyToken, async (req, res) => {
    try {
        const tokenRow = await getTokenRecord(req.user.id, 'microsoft');
        if (!tokenRow) {
            return res.status(400).json({ success: false, error: 'Conta Microsoft não conectada' });
        }

        const accessToken = await ensureMicrosoftAccessToken(tokenRow);
        assertEnv(MICROSOFT_REQUIRED_ENV);

        const teamsRes = await fetch('https://graph.microsoft.com/v1.0/me/joinedTeams', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!teamsRes.ok) {
            const text = await teamsRes.text();
            throw new Error(`Falha ao listar equipes: ${text}`);
        }

        const json = await teamsRes.json();
        const teams = (json.value || []).map((t) => ({
            id: t.id,
            displayName: t.displayName,
            description: t.description,
            visibility: t.visibility
        }));

        await User.update({ lastSyncAt: new Date() }, { where: { id: req.user.id } });

        res.status(200).json({
            success: true,
            provider: 'microsoft_teams',
            teamCount: teams.length,
            teams
        });
    } catch (err) {
        console.error('Erro sync Teams', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/sync/status', verifyToken, async (req, res) => {
    try {
        const [googleToken, msToken] = await Promise.all([
            getTokenRecord(req.user.id, 'google'),
            getTokenRecord(req.user.id, 'microsoft')
        ]);

        const buildStatus = (row) => {
            if (!row) return { connected: false };
            return {
                connected: true,
                expiresAt: row.expiresAt,
                hasRefresh: !!row.refreshToken,
                willExpireSoon: isExpired(row.expiresAt)
            };
        };

        const user = await User.findByPk(req.user.id, { attributes: ['lastSyncAt'] });

        res.status(200).json({
            success: true,
            google: buildStatus(googleToken),
            microsoft: buildStatus(msToken),
            lastSyncAt: user?.lastSyncAt || null
        });
    } catch (err) {
        console.error('Erro status sync', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
