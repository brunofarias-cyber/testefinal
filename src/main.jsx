import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Debug logging
console.log('🚀 main.jsx iniciando...');
console.log('📁 document.getElementById("root"):', document.getElementById('root'));

// Error boundary simples para exibir erros em tela (evita tela em branco)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Erro capturado pelo ErrorBoundary:', error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px', fontFamily: 'Inter, system-ui', background: '#0f172a', color: '#e2e8f0', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>⚠️ Erro no front-end</h1>
          <p style={{ marginBottom: '12px', color: '#cbd5e1' }}>Copie essa mensagem para eu corrigir rapidamente:</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
            {this.state.error?.toString()}
          </pre>
          {this.state.info?.componentStack && (
            <details style={{ marginTop: '12px' }}>
              <summary>Stack</summary>
              <pre style={{ whiteSpace: 'pre-wrap', background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                {this.state.info.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('✅ ErrorBoundary criado');
const rootElement = document.getElementById('root');
console.log('📍 Root element:', rootElement);

// Captura global de erros para enviar ao backend (/api/client-log)
const sendClientLog = (level, message, extra = {}) => {
  try {
    const payload = JSON.stringify({
      level,
      message,
      extra,
      timestamp: new Date().toISOString()
    });
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/client-log', blob);
  } catch (err) {
    // evita loop em caso de falha de log
    console.warn('client-log failed', err);
  }
};

window.addEventListener('error', (event) => {
  sendClientLog('error', event.message || 'window.onerror', {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack || String(event.error)
  });
});

window.addEventListener('unhandledrejection', (event) => {
  sendClientLog('error', event.reason?.message || 'unhandledrejection', {
    stack: event.reason?.stack || String(event.reason)
  });
});

if (!rootElement) {
  console.error('❌ ERRO: Elemento root não encontrado!');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">❌ Elemento root não encontrado no HTML</div>';
} else {
  try {
    console.log('🔄 Iniciando createRoot...');
    const root = createRoot(rootElement);
    console.log('✅ Root criado com sucesso');
    
    console.log('🎨 Renderizando app...');
    root.render(
      <StrictMode>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </StrictMode>
    );
    console.log('✅ App renderizado com sucesso');
    
    // Check DOM after render
    setTimeout(() => {
      const rootDiv = document.getElementById('root');
      console.log('🔍 DOM CHECK - root.innerHTML length:', (rootDiv?.innerHTML || '').length);
      console.log('🔍 DOM CHECK - root.children count:', rootDiv?.children?.length || 0);
      console.log('🔍 DOM CHECK - document.body.innerHTML length:', document.body.innerHTML.length);
    }, 1000);
  } catch (error) {
    console.error('❌ Erro ao renderizar:', error);
    document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>❌ Erro ao renderizar app</h1><pre>${error.message}</pre></div>`;
  }
}
