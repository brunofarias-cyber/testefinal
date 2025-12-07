# 📋 Exemplo de Uso - Chat Isolado por Equipe

Este arquivo demonstra como integrar o **TeamChatComponent** em diferentes cenários.

---

## 📦 Instalação Rápida

```bash
# 1. Instalar dependências
npm install socket.io socket.io-client

# 2. Iniciar servidor
npm run dev
```

---

## 🎯 Exemplo 1: Chat Simples (Aluno)

```javascript
import React from 'react';
import TeamChatComponent from './components/TeamChatComponent';

function StudentChatPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat da Equipe</h1>
      
      <TeamChatComponent 
        teamId={1}
        currentUserId={101}
        currentUserRole="student"
        currentUserName="João Silva"
        currentUserAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Joao"
        teamName="Equipe Alpha"
      />
    </div>
  );
}

export default StudentChatPage;
```

---

## 🎯 Exemplo 2: Chat de Professor (Múltiplas Equipes)

```javascript
import React, { useState } from 'react';
import TeamChatComponent from './components/TeamChatComponent';
import { Users, ChevronRight } from 'lucide-react';

function TeacherChatPage() {
  const [selectedTeam, setSelectedTeam] = useState(1);
  
  const teams = [
    { id: 1, name: 'Equipe Alpha', unread: 3 },
    { id: 2, name: 'Equipe Beta', unread: 0 },
    { id: 3, name: 'Equipe Gamma', unread: 7 },
    { id: 4, name: 'Equipe Delta', unread: 1 }
  ];
  
  const professor = {
    id: 1,
    name: 'Profª Ana Silva',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    role: 'teacher'
  };
  
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar - Lista de Equipes */}
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users size={24} />
            Minhas Equipes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {teams.length} equipes ativas
          </p>
        </div>
        
        <div className="p-2">
          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`w-full p-4 rounded-xl mb-2 text-left transition flex items-center justify-between group ${
                selectedTeam === team.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div>
                <p className="font-bold">{team.name}</p>
                <p className={`text-sm ${
                  selectedTeam === team.id ? 'text-white/80' : 'text-slate-500'
                }`}>
                  team_id: {team.id}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {team.unread > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    selectedTeam === team.id
                      ? 'bg-white text-indigo-600'
                      : 'bg-red-500 text-white'
                  }`}>
                    {team.unread}
                  </span>
                )}
                <ChevronRight 
                  size={20} 
                  className={selectedTeam === team.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat da Equipe Selecionada */}
      <div className="flex-1">
        <TeamChatComponent 
          teamId={selectedTeam}
          currentUserId={professor.id}
          currentUserRole={professor.role}
          currentUserName={professor.name}
          currentUserAvatar={professor.avatar}
          teamName={teams.find(t => t.id === selectedTeam)?.name || 'Equipe'}
        />
      </div>
    </div>
  );
}

export default TeacherChatPage;
```

---

## 🎯 Exemplo 3: Integração com Context API

```javascript
// contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 101,
    name: 'João Silva',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
    role: 'student'
  });
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```javascript
// contexts/TeamContext.jsx
import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [currentTeam, setCurrentTeam] = useState({
    id: 1,
    name: 'Equipe Alpha'
  });
  
  return (
    <TeamContext.Provider value={{ currentTeam, setCurrentTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
```

```javascript
// pages/ChatPage.jsx
import React from 'react';
import TeamChatComponent from '../components/TeamChatComponent';
import { useAuth } from '../contexts/AuthContext';
import { useTeam } from '../contexts/TeamContext';

function ChatPage() {
  const { user } = useAuth();
  const { currentTeam } = useTeam();
  
  return (
    <div className="h-screen">
      <TeamChatComponent 
        teamId={currentTeam.id}
        currentUserId={user.id}
        currentUserRole={user.role}
        currentUserName={user.name}
        currentUserAvatar={user.avatar}
        teamName={currentTeam.name}
      />
    </div>
  );
}

export default ChatPage;
```

---

## 🎯 Exemplo 4: Chat em Modal (Pop-up)

```javascript
import React, { useState } from 'react';
import TeamChatComponent from './components/TeamChatComponent';
import { MessageSquare, X } from 'lucide-react';

function ProjectPage() {
  const [showChat, setShowChat] = useState(false);
  
  return (
    <div className="p-8">
      <h1>Meu Projeto</h1>
      
      {/* Botão Flutuante */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-2xl transition"
      >
        <MessageSquare size={28} />
      </button>
      
      {/* Modal de Chat */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Chat da Equipe</h2>
              <button
                onClick={() => setShowChat(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Chat Component */}
            <div className="flex-1 overflow-hidden">
              <TeamChatComponent 
                teamId={1}
                currentUserId={101}
                currentUserRole="student"
                currentUserName="João Silva"
                currentUserAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Joao"
                teamName="Equipe Alpha"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
```

---

## 🎯 Exemplo 5: Chat com Tabs (Múltiplas Equipes)

```javascript
import React, { useState } from 'react';
import TeamChatComponent from './components/TeamChatComponent';

function MultiTeamChatPage() {
  const [activeTab, setActiveTab] = useState(1);
  
  const teams = [
    { id: 1, name: 'Equipe Alpha' },
    { id: 2, name: 'Equipe Beta' },
    { id: 3, name: 'Equipe Gamma' }
  ];
  
  const user = {
    id: 1,
    name: 'Profª Ana Silva',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    role: 'teacher'
  };
  
  return (
    <div className="h-screen flex flex-col">
      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 flex gap-2 p-2">
        {teams.map(team => (
          <button
            key={team.id}
            onClick={() => setActiveTab(team.id)}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === team.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>
      
      {/* Chat da Tab Ativa */}
      <div className="flex-1">
        <TeamChatComponent 
          teamId={activeTab}
          currentUserId={user.id}
          currentUserRole={user.role}
          currentUserName={user.name}
          currentUserAvatar={user.avatar}
          teamName={teams.find(t => t.id === activeTab)?.name}
        />
      </div>
    </div>
  );
}

export default MultiTeamChatPage;
```

---

## 🎯 Exemplo 6: Buscar Mensagens da API

```javascript
import React, { useState, useEffect } from 'react';
import TeamChatComponent from './components/TeamChatComponent';

function ChatWithAPI() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Buscar equipes do usuário
    fetch('http://localhost:3000/api/user/teams', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams);
        if (data.teams.length > 0) {
          setSelectedTeam(data.teams[0].id);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar equipes:', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return <div>Carregando equipes...</div>;
  }
  
  if (teams.length === 0) {
    return <div>Você não faz parte de nenhuma equipe ainda.</div>;
  }
  
  return (
    <div className="h-screen flex">
      {/* Lista de Equipes */}
      <div className="w-64 bg-slate-100 p-4">
        {teams.map(team => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`w-full p-3 rounded-lg mb-2 ${
              selectedTeam === team.id ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>
      
      {/* Chat */}
      <div className="flex-1">
        {selectedTeam && (
          <TeamChatComponent 
            teamId={selectedTeam}
            currentUserId={parseInt(localStorage.getItem('userId'))}
            currentUserRole={localStorage.getItem('userRole')}
            currentUserName={localStorage.getItem('userName')}
            currentUserAvatar={localStorage.getItem('userAvatar')}
            teamName={teams.find(t => t.id === selectedTeam)?.name}
          />
        )}
      </div>
    </div>
  );
}

export default ChatWithAPI;
```

---

## 🎯 Exemplo 7: Chat Embarcado (Sidebar)

```javascript
import React from 'react';
import TeamChatComponent from './components/TeamChatComponent';

function ProjectWithChatSidebar() {
  return (
    <div className="h-screen flex">
      {/* Conteúdo Principal */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Horta Escolar</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Descrição do Projeto</h2>
          <p className="text-slate-600">
            Este projeto visa criar uma horta sustentável na escola...
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Tarefas</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <input type="checkbox" checked />
              <span>Pesquisar sobre plantas</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Preparar o solo</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Chat Sidebar */}
      <div className="w-96 border-l border-slate-200">
        <TeamChatComponent 
          teamId={1}
          currentUserId={101}
          currentUserRole="student"
          currentUserName="João Silva"
          currentUserAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Joao"
          teamName="Equipe Alpha"
        />
      </div>
    </div>
  );
}

export default ProjectWithChatSidebar;
```

---

## 🎯 Exemplo 8: Verificar Permissões no Frontend

```javascript
import React, { useState, useEffect } from 'react';
import TeamChatComponent from './components/TeamChatComponent';

function SecureChatPage({ teamId, userId }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar se usuário tem acesso à equipe
    fetch(`http://localhost:3000/api/teams/${teamId}/members`, {
      headers: {
        'user-id': userId.toString(),
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res.status === 403) {
          setHasAccess(false);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          const isMember = data.data.some(m => m.user_id === userId);
          setHasAccess(isMember);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao verificar acesso:', error);
        setHasAccess(false);
        setLoading(false);
      });
  }, [teamId, userId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Verificando permissões...</p>
        </div>
      </div>
    );
  }
  
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Acesso Negado
          </h2>
          <p className="text-slate-600">
            Você não tem permissão para acessar este chat.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <TeamChatComponent 
      teamId={teamId}
      currentUserId={userId}
      currentUserRole="student"
      currentUserName="João Silva"
      currentUserAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Joao"
      teamName="Equipe Alpha"
    />
  );
}

export default SecureChatPage;
```

---

## 📝 Notas Importantes

### Props Obrigatórias
```javascript
<TeamChatComponent 
  teamId={1}              // ID da equipe (obrigatório)
  currentUserId={101}     // ID do usuário logado (obrigatório)
  currentUserRole="student" // Papel do usuário (obrigatório)
/>
```

### Props Opcionais
```javascript
<TeamChatComponent 
  teamName="Equipe Alpha"           // Nome da equipe (default: "Equipe Alpha")
  currentUserName="João Silva"      // Nome do usuário (default: "Você")
  currentUserAvatar="https://..."   // Avatar do usuário (default: gerado)
/>
```

### Valores Válidos para `currentUserRole`
- `"student"` - Aluno
- `"teacher"` - Professor
- `"collaborator"` - Colaborador

---

## 🔒 Garantir Isolamento

### No Componente
```javascript
// Sempre filtrar mensagens por team_id
const teamMessages = messages.filter(m => m.team_id === teamId);

// Sempre incluir teamId nas requisições
fetch(`http://localhost:3000/api/teams/${teamId}/messages`);
```

### No Backend
```javascript
// Sempre verificar permissão
router.get('/:teamId/messages', verifyTeamAccess, async (req, res) => {
  // Só executa se usuário for membro
});
```

### No Socket.io
```javascript
// Sempre usar rooms isolados
socket.join(`team-${teamId}`);
io.to(`team-${teamId}`).emit('message', data);
```

---

## 🚀 Deploy em Produção

### 1. Configurar Variáveis de Ambiente
```bash
# .env
FRONTEND_URL=https://seu-dominio.com
SOCKET_IO_CORS_ORIGIN=https://seu-dominio.com
```

### 2. Atualizar URL no Frontend
```javascript
// TeamChatComponent.jsx
const socket = io('https://api.seu-dominio.com', {
  transports: ['websocket'],
  auth: {
    userId: currentUserId,
    token: localStorage.getItem('token')
  }
});
```

### 3. Testar Isolamento
- Criar 2 equipes
- Logar com 2 usuários diferentes
- Enviar mensagens
- Verificar que não vazam entre equipes

---

**Pronto para usar! 🚀**
