import React from 'react';

function App() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ color: '#4F46E5', fontSize: '48px', marginBottom: '20px' }}>
        ✅ Sistema Funcionando!
      </h1>
      <p style={{ fontSize: '24px', color: '#64748B' }}>
        Se você está vendo esta mensagem, o React está carregando corretamente.
      </p>
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#F1F5F9', borderRadius: '10px' }}>
        <h2 style={{ color: '#1E293B' }}>📊 Status:</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '18px' }}>
          <li>✅ React: OK</li>
          <li>✅ Vite: OK</li>
          <li>✅ Servidor: Rodando</li>
          <li>✅ Data: {new Date().toLocaleDateString('pt-BR')}</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
