import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

// URL da API - como o backend está integrado com Vite, usamos URL relativa
const API_URL = '';

// ========== GERENCIADOR DE AUTENTICAÇÃO COM API ==========

const AuthManager = {
    // Registrar novo usuário
    register: async (email, password, name, role) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, role })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('bprojetos_token', data.token);
                localStorage.setItem('bprojetos_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }
            return { success: false, error: data.error || 'Erro ao registrar' };
        } catch (error) {
            return { success: false, error: 'Erro de conexão com servidor' };
        }
    },

    // Fazer login
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('bprojetos_token', data.token);
                localStorage.setItem('bprojetos_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }
            return { success: false, error: data.error || 'Email ou senha incorretos' };
        } catch (error) {
            return { success: false, error: 'Erro ao conectar com servidor' };
        }
    },

    // Obter usuário logado
    getCurrentUser: () => {
        const user = localStorage.getItem('bprojetos_user');
        return user ? JSON.parse(user) : null;
    },

    // Obter token
    getToken: () => {
        return localStorage.getItem('bprojetos_token');
    },

    // Logout
    logout: () => {
        localStorage.removeItem('bprojetos_token');
        localStorage.removeItem('bprojetos_user');
    },

    // Validar email
    isValidEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // Força de senha
    getPasswordStrength: (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        return strength;
    }
};

// ========== COMPONENTE DE LOGIN ==========

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await AuthManager.login(email, password);
        if (result.success) {
            onLogin(result.user);
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    // Contas demo para facilitar testes
    const handleDemoLogin = (demoEmail, demoPassword) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
    };

    if (showRegister) {
        return <RegisterScreen onBack={() => setShowRegister(false)} onSuccess={(user) => onLogin(user)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-800">BProjetos</h1>
                    <p className="text-slate-600 mt-2">Gestão Educacional Inteligente</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Entrar</h2>

                    {/* Demo Accounts */}
                    <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-900 mb-2">🎯 Contas Demo:</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleDemoLogin('professor@bprojetos.com', 'prof123')}
                                className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-100"
                            >
                                Professor
                            </button>
                            <button
                                onClick={() => handleDemoLogin('aluno@bprojetos.com', 'aluno123')}
                                className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-green-600 hover:bg-green-50"
                            >
                                Aluno
                            </button>
                            <button
                                onClick={() => handleDemoLogin('coordenador@bprojetos.com', 'coord123')}
                                className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-purple-600 hover:bg-purple-50"
                            >
                                Coordenador
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Não tem conta?{" "}
                            <button onClick={() => setShowRegister(true)} className="text-indigo-600 font-bold hover:text-indigo-700">
                                Criar conta
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========== COMPONENTE DE REGISTRO ==========

const RegisterScreen = ({ onBack, onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const passwordStrength = AuthManager.getPasswordStrength(password);
    const strengthText = ["Muito fraca", "Fraca", "Normal", "Forte", "Muito forte"];
    const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!AuthManager.isValidEmail(email)) {
            setError("Email inválido");
            return;
        }

        if (password.length < 6) {
            setError("Senha deve ter no mínimo 6 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("Senhas não conferem");
            return;
        }

        setLoading(true);
        const result = await AuthManager.register(email, password, name, role);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => onSuccess(result.user), 1500);
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Conta Criada!</h2>
                        <p className="text-slate-600">Redirecionando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <button onClick={onBack} className="mb-4 text-slate-600 hover:text-indigo-600 font-semibold transition">
                    ← Voltar
                </button>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Criar Conta</h2>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Nome completo"
                            required
                        />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Email"
                            required
                        />

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            <option value="student">👨‍🎓 Aluno</option>
                            <option value="teacher">👨‍🏫 Professor</option>
                            <option value="coordinator">👨‍💼 Coordenador</option>
                        </select>

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Senha"
                                required
                            />
                            {password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColor[passwordStrength - 1] : "bg-slate-200"
                                                    }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600">{strengthText[passwordStrength - 1]}</p>
                                </div>
                            )}
                        </div>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Confirmar senha"
                            required
                        />

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
                        >
                            {loading ? "Criando..." : "Criar Conta"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { AuthManager, LoginScreen };
