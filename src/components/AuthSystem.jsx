import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight, Home } from "lucide-react";

const BrandLogo = ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bookGradient" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4338ca" />
                <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="plantGradient" x1="50" y1="100" x2="50" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#15803d" />
                <stop offset="1" stopColor="#4ade80" />
            </linearGradient>
        </defs>
        <path d="M10 75 C10 75 30 85 50 75 C70 65 90 75 90 75 V 85 C90 85 70 75 50 85 C30 95 10 85 10 85 V 75 Z" fill="url(#bookGradient)" opacity="0.8" />
        <path d="M10 70 C10 70 30 80 50 70 C70 60 90 70 90 70 V 80 C90 80 70 70 50 80 C30 90 10 80 10 80 V 70 Z" fill="white" opacity="0.3" />
        <path d="M50 75 V 85" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 75 Q 50 50 50 30" stroke="url(#plantGradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 50 Q 70 40 80 20 Q 60 20 50 50" fill="url(#plantGradient)" />
        <path d="M50 40 Q 30 30 20 10 Q 40 10 50 40" fill="url(#plantGradient)" opacity="0.9" />
        <circle cx="20" cy="10" r="4" fill="#8b5cf6" />
        <circle cx="80" cy="20" r="4" fill="#8b5cf6" />
        <circle cx="35" cy="25" r="3" fill="#8b5cf6" />
        <circle cx="65" cy="30" r="3" fill="#8b5cf6" />
    </svg>
);

// ========== GERENCIADOR DE AUTENTICAÇÃO ==========

const AuthManager = {
    // Obter usuários do localStorage
    getUsers: () => {
        const users = localStorage.getItem("nexo_users");
        return users ? JSON.parse(users) : [
            {
                id: 1,
                email: "professor@nexo.com",
                password: "prof123",
                name: "Ana Silva",
                role: "teacher",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                email: "aluno@nexo.com",
                password: "aluno123",
                name: "João Silva",
                role: "student",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                email: "coordenador@nexo.com",
                password: "coord123",
                name: "Roberto Lima",
                role: "coordinator",
                createdAt: new Date().toISOString()
            }
        ];
    },

    // Salvar usuários no localStorage
    saveUsers: (users) => {
        localStorage.setItem("nexo_users", JSON.stringify(users));
    },

    // Validar email
    isValidEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar força de senha
    getPasswordStrength: (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        return strength;
    },

    // Registrar novo usuário
    register: (email, password, name, role) => {
        const users = AuthManager.getUsers();

        if (users.find(u => u.email === email)) {
            return { success: false, error: "Email já cadastrado" };
        }

        const newUser = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            email,
            password,
            name,
            role,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        AuthManager.saveUsers(users);
        return { success: true, user: newUser };
    },

    // Fazer login
    login: (email, password) => {
        const users = AuthManager.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        return user ? { success: true, user } : { success: false, error: "Email ou senha incorretos" };
    },

    // Salvar session do usuário logado
    setCurrentUser: (user) => {
        localStorage.setItem("nexo_current_user", JSON.stringify(user));
    },

    // Obter usuário logado
    getCurrentUser: () => {
        const user = localStorage.getItem("nexo_current_user");
        return user ? JSON.parse(user) : null;
    },

    // Logout
    logout: () => {
        localStorage.removeItem("nexo_current_user");
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

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            const result = AuthManager.login(email, password);
            if (result.success) {
                AuthManager.setCurrentUser(result.user);
                onLogin(result.user);
            } else {
                setError(result.error);
                setLoading(false);
            }
        }, 800);
    };

    const handleDemoLogin = (demoEmail, demoPassword) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
        setTimeout(() => {
            const result = AuthManager.login(demoEmail, demoPassword);
            if (result.success) {
                AuthManager.setCurrentUser(result.user);
                onLogin(result.user);
            }
        }, 500);
    };

    if (showRegister) {
        return <RegisterScreen onBack={() => setShowRegister(false)} onSuccess={() => setShowRegister(false)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <BrandLogo size={48} />
                        <h1 className="text-4xl font-extrabold text-slate-800">BProjetos</h1>
                    </div>
                    <p className="text-slate-600">Gestão Educacional Inteligente</p>
                </div>

                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Entrar na Plataforma</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <>Entrando...</> : <>Entrar <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600 mb-4">
                            Não tem conta?{" "}
                            <button
                                onClick={() => setShowRegister(true)}
                                className="text-indigo-600 font-bold hover:text-indigo-700"
                            >
                                Criar conta
                            </button>
                        </p>
                    </div>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-xs text-slate-400 font-bold uppercase">Contas Demo</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <div className="space-y-2">
                        {[
                            { email: "professor@bprojetos.com", password: "prof123", name: "Profª Ana Silva", role: "👨‍🏫" },
                            { email: "aluno@bprojetos.com", password: "aluno123", name: "João Silva", role: "👨‍🎓" },
                            { email: "coordenador@bprojetos.com", password: "coord123", name: "Roberto Lima", role: "👨‍💼" }
                        ].map((demo) => (
                            <button
                                key={demo.email}
                                onClick={() => handleDemoLogin(demo.email, demo.password)}
                                className="w-full p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-xl text-left flex items-center justify-between group"
                            >
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">
                                        {demo.role} {demo.name}
                                    </p>
                                    <p className="text-xs text-slate-500">{demo.email}</p>
                                </div>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
                            </button>
                        ))}
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
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const passwordStrength = AuthManager.getPasswordStrength(password);
    const strengthText = ["Muito fraca", "Fraca", "Normal", "Forte", "Muito forte"];
    const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");

        // Validações
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

        if (!name.trim()) {
            setError("Nome é obrigatório");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const result = AuthManager.register(email, password, name, role);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onSuccess();
                }, 2000);
            } else {
                setError(result.error);
                setLoading(false);
            }
        }, 800);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-200">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Conta Criada!</h2>
                        <p className="text-slate-600 mb-6">Sua conta foi criada com sucesso. Redirecionando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md relative z-10">
                <button
                    onClick={onBack}
                    className="mb-4 text-slate-600 hover:text-indigo-600 font-semibold flex items-center gap-2"
                >
                    ← Voltar para Login
                </button>

                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Criar Conta</h2>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                            <div className="relative">
                                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="João Silva"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Conta</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="student">👨‍🎓 Aluno</option>
                                <option value="teacher">👨‍🏫 Professor</option>
                                <option value="coordinator">👨‍💼 Coordenador</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {password && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full ${i < passwordStrength ? strengthColor[passwordStrength - 1] : "bg-slate-200"
                                                    }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Força: {strengthText[Math.max(0, passwordStrength - 1)]}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Confirmar Senha</label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg"
                        >
                            {loading ? "Criando conta..." : "Criar Conta"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { AuthManager, LoginScreen, RegisterScreen };
