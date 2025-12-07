import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
