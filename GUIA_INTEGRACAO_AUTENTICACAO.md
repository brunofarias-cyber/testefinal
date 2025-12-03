# Guia de Integração da Autenticação

Este guia descreve como o sistema de autenticação foi integrado ao BProjetos.

## Componentes

### 1. AuthSystem (`src/components/AuthSystem.jsx`)
Contém a lógica de autenticação e as telas de login/registro.
- **AuthManager**: Gerencia usuários e sessão via `localStorage`.
- **LoginScreen**: Tela de login com suporte a contas demo.
- **RegisterScreen**: Tela de cadastro com validação.

### 2. StudentDashboard (`src/components/StudentDashboard.jsx`)
Dashboard exclusivo para o perfil de aluno, exibindo:
- KPIs (Média, Frequência, Engajamento)
- Lista de Projetos
- Próximas Tarefas
- Conquistas

## Integração no App.jsx

A integração foi feita substituindo a antiga `LandingPage` pela `LoginScreen` e gerenciando o estado do usuário logado.

### Alterações Principais:

1. **Estado de Usuário**:
   ```javascript
   const [currentUser, setCurrentUser] = useState(null);
   ```

2. **Verificação de Sessão**:
   Ao carregar a aplicação, verificamos se existe um usuário salvo no `localStorage`.
   ```javascript
   useEffect(() => {
       const user = AuthManager.getCurrentUser();
       if (user) { ... }
   }, []);
   ```

3. **Login/Logout**:
   - `handleLogin`: Atualiza o estado e redireciona para o dashboard apropriado.
   - `handleLogout`: Limpa a sessão e retorna para a tela de login.

4. **Sidebar**:
   Atualizada para exibir o nome e email do usuário logado.

## Contas de Demonstração

| Perfil | Email | Senha |
|--------|-------|-------|
| Professor | professor@bprojetos.com | prof123 |
| Aluno | aluno@bprojetos.com | aluno123 |
| Coordenador | coordenador@bprojetos.com | coord123 |

## Próximos Passos

- Implementar backend real para substituir o `localStorage`.
- Adicionar recuperação de senha.
- Melhorar a gestão de perfis e permissões.
