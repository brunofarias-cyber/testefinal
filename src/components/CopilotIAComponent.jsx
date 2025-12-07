import React, { useState } from 'react';
import { Bot, FileText, Zap, Book, Edit, Send } from 'lucide-react';

const CopilotIAComponent = () => {
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            sender: 'ai', 
            text: 'Olá! Sou seu Copiloto IA 🤖 Estou aqui para ajudar com seus projetos. O que você precisa hoje?',
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [quickActions] = useState([
        { id: 1, label: 'Como começar meu relatório?', icon: FileText },
        { id: 2, label: 'Ideias para apresentação', icon: Zap },
        { id: 3, label: 'Explicar conceito difícil', icon: Book },
        { id: 4, label: 'Revisar meu texto', icon: Edit }
    ]);

    const aiResponses = {
        'relatório': 'Para começar um relatório de qualidade:\n\n1. **Introdução** - Apresente o tema e objetivos\n2. **Desenvolvimento** - Explique o que você fez passo a passo\n3. **Resultados** - Mostre o que descobriu/criou\n4. **Conclusão** - O que aprendeu?\n\nQuer ajuda com alguma parte específica?',
        'apresentação': 'Ideias para uma apresentação impactante:\n\n✨ Use storytelling (conte uma história)\n🎨 Slides visuais (menos texto, mais imagens)\n🎯 Comece com uma pergunta intrigante\n📊 Mostre dados com gráficos\n🎬 Inclua um vídeo curto (30-60s)\n\nQual dessas você quer explorar?',
        'ajuda': 'Posso te ajudar com:\n\n📝 Estruturar trabalhos\n💡 Gerar ideias criativas\n📚 Explicar conceitos\n✅ Revisar textos\n🎯 Organizar tarefas\n\nÉ só perguntar!',
        'default': 'Interessante! Vou te ajudar com isso. Pode me dar mais detalhes sobre o que você precisa? Assim consigo te dar uma resposta mais personalizada.'
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: input,
            timestamp: new Date().toISOString()
        };

        setMessages([...messages, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simular resposta da IA
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let response = aiResponses.default;

            if (lowerInput.includes('relatório') || lowerInput.includes('relatorio')) {
                response = aiResponses.relatório;
            } else if (lowerInput.includes('apresenta')) {
                response = aiResponses.apresentação;
            } else if (lowerInput.includes('ajuda') || lowerInput.includes('help')) {
                response = aiResponses.ajuda;
            }

            const aiMessage = {
                id: messages.length + 2,
                sender: 'ai',
                text: response,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleQuickAction = (action) => {
        setInput(action.label);
    };

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Copiloto IA</h2>
                        <p className="text-slate-500">Seu assistente inteligente para projetos</p>
                    </div>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {quickActions.map(action => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.id}
                            onClick={() => handleQuickAction(action)}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition text-left group"
                        >
                            <Icon size={18} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-semibold text-slate-700">{action.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.sender === 'ai' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-indigo-100'
                            }`}>
                                {msg.sender === 'ai' ? (
                                    <Bot size={16} className="text-white" />
                                ) : (
                                    <span className="text-sm font-bold text-indigo-600">Eu</span>
                                )}
                            </div>
                            <div className={`max-w-md p-4 rounded-2xl ${
                                msg.sender === 'ai' 
                                ? 'bg-slate-50 border border-slate-100' 
                                : 'bg-indigo-600 text-white'
                            }`}>
                                <p className={`text-sm whitespace-pre-line ${
                                    msg.sender === 'ai' ? 'text-slate-700' : 'text-white'
                                }`}>{msg.text}</p>
                                <p className={`text-xs mt-2 ${
                                    msg.sender === 'ai' ? 'text-slate-400' : 'text-indigo-200'
                                }`}>
                                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-100 p-4 bg-slate-50">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Digite sua pergunta..."
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            <Send size={18} />
                            Enviar
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                        💡 Dica: Seja específico nas perguntas para respostas mais úteis!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CopilotIAComponent;
