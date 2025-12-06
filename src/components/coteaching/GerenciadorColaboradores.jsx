import React, { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, AlertCircle, Check, Copy, X, User } from 'lucide-react';

const GerenciadorColaboradores = ({ projetoId, projetoTitulo }) => {
    const [colaboradores, setColaboradores] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [emailConvite, setEmailConvite] = useState('');
    const [enviandoConvite, setEnviandoConvite] = useState(false);
    const [copiadoToken, setCopiadoToken] = useState(false);
    const [inviteLinkGerado, setInviteLinkGerado] = useState(null);

    // Carregar colaboradores
    useEffect(() => {
        carregarColaboradores();
    }, [projetoId]);

    const carregarColaboradores = async () => {
        try {
            setCarregando(true);
            const response = await fetch(
                `/api/coteaching/projetos/${projetoId}/colaboradores`,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );
            const data = await response.json();

            if (!data.sucesso) throw new Error(data.erro);

            setColaboradores(data.dados);
            setErro(null);
        } catch (err) {
            setErro(err.message);
            console.error('Erro ao carregar colaboradores:', err);
        } finally {
            setCarregando(false);
        }
    };

    const handleConvidar = async () => {
        if (!emailConvite.trim()) {
            setErro('Digite um email válido');
            return;
        }

        try {
            setEnviandoConvite(true);

            const response = await fetch(
                `/api/coteaching/projetos/${projetoId}/convidar`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        emailProfessor: emailConvite
                    })
                }
            );

            const data = await response.json();

            if (!data.sucesso) throw new Error(data.erro);

            // Mostrar link do convite
            setInviteLinkGerado(data.dados.acceptanceUrl);
            setEmailConvite('');

            // Recarregar colaboradores
            setTimeout(() => {
                carregarColaboradores();
            }, 1000);
        } catch (err) {
            setErro(err.message);
        } finally {
            setEnviandoConvite(false);
        }
    };

    const handleRemover = async (professorId) => {
        if (!window.confirm('Tem certeza que deseja remover este colaborador?')) {
            return;
        }

        try {
            const response = await fetch(
                `/api/coteaching/projetos/${projetoId}/colaboradores/${professorId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            const data = await response.json();

            if (!data.sucesso) throw new Error(data.erro);

            setColaboradores(colaboradores.filter(c => c.professor.id !== professorId));
        } catch (err) {
            setErro(err.message);
        }
    };

    const copiarLink = () => {
        navigator.clipboard.writeText(inviteLinkGerado);
        setCopiadoToken(true);
        setTimeout(() => setCopiadoToken(false), 2000);
    };

    if (carregando) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Colaboradores</h2>
                    <p className="text-slate-600 text-sm mt-1">{projetoTitulo}</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    Convidar Professor
                </button>
            </div>

            {/* Mensagens */}
            {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-red-800">Erro</h3>
                        <p className="text-sm text-red-700">{erro}</p>
                    </div>
                </div>
            )}

            {/* Link de Convite Gerado */}
            {inviteLinkGerado && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Check size={18} className="text-green-600" />
                        <p className="font-bold text-blue-900">Convite gerado com sucesso!</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-3 rounded border border-blue-200">
                        <input
                            type="text"
                            value={inviteLinkGerado}
                            readOnly
                            className="flex-1 bg-transparent outline-none text-sm text-slate-700"
                        />
                        <button
                            onClick={copiarLink}
                            className={`px-3 py-1 rounded text-sm font-bold transition flex items-center gap-1 ${copiadoToken
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                        >
                            {copiadoToken ? <Check size={14} /> : <Copy size={14} />}
                            {copiadoToken ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                        💡 Compartilhe este link com o professor. Ele precisa estar registrado para aceitar.
                    </p>
                </div>
            )}

            {/* Lista de Colaboradores */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                {colaboradores.length === 0 ? (
                    <div className="p-8 text-center">
                        <User size={32} className="text-slate- mx-auto mb-2" />
                        <p className="text-slate-600">Nenhum colaborador adicionado ainda</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {colaboradores.map(colaborador => (
                            <div key={colaborador.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={colaborador.professor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${colaborador.professor.email}`}
                                        alt={colaborador.professor.name}
                                        className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"
                                    />
                                    <div>
                                        <p className="font-bold text-slate-800">{colaborador.professor.name}</p>
                                        <p className="text-xs text-slate-500">{colaborador.professor.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                                        {colaborador.papel}
                                    </span>
                                    <button
                                        onClick={() => handleRemover(colaborador.professor.id)}
                                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                                        title="Remover colaborador"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Convite */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Convidar Professor</h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEmailConvite('');
                                    setErro(null);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Email do Professor
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="email"
                                            value={emailConvite}
                                            onChange={(e) => setEmailConvite(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleConvidar()}
                                            placeholder="professor@escola.com"
                                            className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs text-blue-800">
                                    💡 <strong>Importante:</strong> O professor deve estar registrado na plataforma para aceitar o convite.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 p-6 border-t border-slate-200 bg-slate-50">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEmailConvite('');
                                }}
                                className="flex-1 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-bold transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConvidar}
                                disabled={enviandoConvite}
                                className={`flex-1 px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition ${enviandoConvite
                                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                            >
                                {enviandoConvite ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Mail size={16} />
                                        Convidar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciadorColaboradores;
