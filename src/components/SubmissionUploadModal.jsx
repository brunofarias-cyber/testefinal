import React, { useState } from 'react';
import { X, Check, AlertCircle, Loader, Upload, FileText } from 'lucide-react';

const SubmissionUploadModal = ({
    projectTitle = 'Horta Sustentável',
    projectId = 1,
    studentId = 101,
    onClose = () => {},
    onSubmit = () => {}
}) => {
    const [file, setFile] = useState(null);
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [fileError, setFileError] = useState(null);

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/zip'
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        setFileError(null);

        if (!selectedFile) {
            return;
        }

        // Validar tamanho
        if (selectedFile.size > MAX_FILE_SIZE) {
            setFileError(`Arquivo muito grande. Máximo: 50MB. Seu arquivo: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
            return;
        }

        // Validar tipo
        if (!ALLOWED_TYPES.includes(selectedFile.type)) {
            setFileError('Tipo de arquivo não permitido. Aceitos: PDF, Word, Excel, TXT, ZIP');
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!file) {
            setError('Selecione um arquivo para enviar');
            setLoading(false);
            return;
        }

        try {
            // Simular upload - em produção, usar FormData e multipart/form-data
            const response = await fetch('/api/submissions/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: parseInt(studentId),
                    projectId: parseInt(projectId),
                    projectTitle: projectTitle,
                    fileName: file.name,
                    fileUrl: `/uploads/${file.name}`,
                    fileSize: file.size,
                    comments: comments || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao enviar arquivo');
            }

            console.log('✅ Arquivo enviado:', data);
            setSuccess(true);

            // Fechar automaticamente após 2 segundos
            setTimeout(() => {
                if (onSubmit) onSubmit(data);
                onClose();
            }, 2000);

        } catch (err) {
            console.error('❌ Erro:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all animate-scaleIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-t-3xl flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-3xl">📤</span>
                        Enviar Entrega
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                {!success ? (
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Projeto Info */}
                        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                            <p className="text-xs font-bold text-purple-900 mb-1 tracking-wide">📋 PROJETO</p>
                            <p className="font-bold text-purple-900">{projectTitle}</p>
                            <p className="text-sm text-purple-700 mt-1">ID: {projectId}</p>
                        </div>

                        {/* File Upload Area */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                📎 Selecione o Arquivo
                            </label>

                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    className="hidden"
                                    id="file-input"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                                />

                                <label
                                    htmlFor="file-input"
                                    className={`flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                                        file
                                            ? 'border-green-500 bg-green-50'
                                            : fileError
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-slate-300 bg-slate-50 hover:border-indigo-400'
                                    }`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                                        {file ? (
                                            <>
                                                <div className="p-3 bg-green-100 rounded-full mb-3">
                                                    <FileText size={32} className="text-green-600" />
                                                </div>
                                                <p className="text-sm font-bold text-green-900 text-center">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-green-700 mt-1">
                                                    {formatFileSize(file.size)}
                                                </p>
                                                <p className="text-xs text-green-600 mt-2">
                                                    ✅ Pronto para enviar
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-3 bg-indigo-100 rounded-full mb-3">
                                                    <Upload size={32} className="text-indigo-600" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    Clique ou arraste seu arquivo
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    PDF, Word, Excel, TXT ou ZIP
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>

                            {/* File Error */}
                            {fileError && (
                                <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-lg">
                                    <p className="text-sm text-red-700 font-semibold">❌ {fileError}</p>
                                </div>
                            )}

                            {/* File Info */}
                            <p className="text-xs text-slate-500 mt-2">
                                Máximo: 50MB | Tipos: PDF, Word, Excel, TXT, ZIP
                            </p>
                        </div>

                        {/* Comments */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                💬 Comentários (opcional)
                            </label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value.slice(0, 500))}
                                placeholder="Ex: Arquivo contém as imagens do projeto e relatório completo..."
                                maxLength={500}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none text-sm"
                                rows={3}
                                disabled={loading}
                            />
                            <p className="text-xs text-slate-500 mt-1">{comments.length}/500</p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                                <p className="text-sm text-red-700 font-semibold">❌ Erro: {error}</p>
                            </div>
                        )}

                        {/* Info */}
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg text-sm text-indigo-900">
                            <p className="font-semibold mb-1">🔔 Você será notificado</p>
                            <p className="text-xs text-indigo-800">
                                Após enviar, você receberá uma confirmação e será notificado quando o professor deixar feedback e nota.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !file}
                                className={`flex-1 px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                                    loading || !file
                                        ? 'bg-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Enviar Arquivo
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    // Success State
                    <div className="p-12 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
                                <Check size={48} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Entrega Enviada! ✅</h3>
                            <p className="text-slate-600 mb-2">
                                {file?.name}
                            </p>
                            <p className="text-sm text-slate-600 mb-4">
                                {formatFileSize(file?.size || 0)}
                            </p>
                            <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
                                <p className="text-sm text-purple-900">
                                    <span className="font-bold">🔔 Pronto para avaliação!</span>
                                    {'\n'}Seu arquivo foi salvo e o professor será notificado para revisar.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionUploadModal;
