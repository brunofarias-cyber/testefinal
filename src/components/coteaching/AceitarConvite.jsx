import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Check } from 'lucide-react';

const AceitarConvite = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(false);

    useEffect(() => {
        const aceitarConvite = async () => {
            // Verificar se está autenticado
            const authToken = localStorage.getItem('token');
            if (!authToken) {
                setErro('Você precisa estar logado para aceitar um convite');
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);

                const response = await fetch(
                    `/api/coteaching/convites/aceitar/${token}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    }
                );

                const data = await response.json();

                if (!data.sucesso) throw new Error(data.erro);

                setSucesso(true);

                // Redirecionar após 2 segundos
                setTimeout(() => {
                    navigate('/');
                }, 2000);

            } catch (err) {
                setErro(err.message);
            } finally {
                setCarregando(false);
            }
        };

        if (token) {
            aceitarConvite();
        }
    }, [token, navigate]);

    if (carregando) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Erro ao aceitar convite</h2>
                        <p className="text-slate-600 mb-4">{erro}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-indigo-600 hover:text-indigo-700 font-bold"
                        >
                            Voltar para Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (sucesso) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Convite aceito!</h2>
                        <p className="text-slate-600 mb-6">
                            Você agora é colaborador do projeto. Redirecionando para o dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default AceitarConvite;
