// ═══════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DO SOCKET.IO PARA CHAT ISOLADO POR EQUIPE
// ═══════════════════════════════════════════════════════════════════════
//
// Este arquivo configura o Socket.io com isolamento de salas (rooms)
// para garantir que mensagens sejam enviadas apenas para membros da equipe
//
// ═══════════════════════════════════════════════════════════════════════

import { Server } from 'socket.io';

// ────────────────────────────────────────────────────────────────
// CONFIGURAR SOCKET.IO NO SERVIDOR EXPRESS
// ────────────────────────────────────────────────────────────────

export const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Armazenar usuários conectados por sala
  const roomUsers = new Map();

  // ────────────────────────────────────────────────────────────────
  // MIDDLEWARE: Autenticação
  // ────────────────────────────────────────────────────────────────

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    const token = socket.handshake.auth.token;

    if (!userId) {
      return next(new Error('Authentication error: userId required'));
    }

    // TODO: Validar token JWT aqui
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (!decoded) return next(new Error('Invalid token'));

    socket.userId = userId;
    console.log(`🔐 Socket autenticado: userId=${userId}`);
    next();
  });

  // ────────────────────────────────────────────────────────────────
  // HELPER: Verificar permissão de acesso à equipe
  // ────────────────────────────────────────────────────────────────

  const checkTeamAccess = async (teamId, userId) => {
    // TODO: Substituir por query real do banco
    // const member = await TeamMember.findOne({
    //   where: { team_id: teamId, user_id: userId }
    // });
    // return member !== null;

    // Mock: Sempre permitir em desenvolvimento
    console.log(`🔍 Verificando acesso: team=${teamId}, user=${userId}`);
    return true; // Em produção, implementar verificação real
  };

  // ────────────────────────────────────────────────────────────────
  // CONEXÃO DO SOCKET
  // ────────────────────────────────────────────────────────────────

  io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id} (userId: ${socket.userId})`);

    // ──────────────────────────────────────────────────────────────
    // EVENTO: Entrar na sala da equipe
    // ──────────────────────────────────────────────────────────────

    socket.on('join-team', async (data) => {
      try {
        const { teamId, userId, userName } = data;

        // Validar permissão
        const hasAccess = await checkTeamAccess(teamId, userId);

        if (!hasAccess) {
          socket.emit('error', {
            message: '🔒 Acesso negado: Você não pertence a esta equipe'
          });
          console.log(`❌ Acesso negado: team=${teamId}, user=${userId}`);
          return;
        }

        // Entrar na sala (ISOLAMENTO POR EQUIPE)
        const roomName = `team-${teamId}`;
        socket.join(roomName);

        // Registrar usuário na sala
        if (!roomUsers.has(roomName)) {
          roomUsers.set(roomName, new Set());
        }
        roomUsers.get(roomName).add({
          socketId: socket.id,
          userId,
          userName
        });

        console.log(`👥 Usuário ${userName} (${userId}) entrou na sala ${roomName}`);
        console.log(`   Total na sala: ${roomUsers.get(roomName).size} usuários`);

        // Notificar outros membros
        socket.to(roomName).emit('user-joined', {
          userId,
          userName,
          message: `${userName} entrou na conversa`,
          timestamp: new Date().toISOString()
        });

        // Confirmar entrada ao usuário
        socket.emit('joined-team', {
          teamId,
          roomName,
          usersCount: roomUsers.get(roomName).size,
          message: `✅ Conectado à sala da equipe ${teamId}`
        });
      } catch (error) {
        console.error('❌ Erro ao entrar na sala:', error);
        socket.emit('error', {
          message: 'Erro ao entrar na sala da equipe'
        });
      }
    });

    // ──────────────────────────────────────────────────────────────
    // EVENTO: Enviar mensagem
    // ──────────────────────────────────────────────────────────────

    socket.on('send-message', async (data) => {
      try {
        const { teamId, userId, message, sender } = data;

        // Validar permissão
        const hasAccess = await checkTeamAccess(teamId, userId);

        if (!hasAccess) {
          socket.emit('error', {
            message: '🔒 Você não tem permissão para enviar mensagens nesta equipe'
          });
          return;
        }

        // Validar mensagem
        if (!message || !message.trim()) {
          socket.emit('error', {
            message: 'Mensagem não pode estar vazia'
          });
          return;
        }

        if (message.length > 500) {
          socket.emit('error', {
            message: 'Mensagem muito longa (máximo 500 caracteres)'
          });
          return;
        }

        // Criar objeto da mensagem
        const newMessage = {
          id: Date.now(),
          team_id: teamId,
          sender_id: userId,
          sender_name: sender?.name || 'Usuário',
          sender_avatar: sender?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
          sender_role: sender?.role || 'student',
          message: message.trim(),
          timestamp: new Date().toISOString(),
          read: false
        };

        const roomName = `team-${teamId}`;

        // Emitir APENAS para membros da equipe (sala isolada)
        io.to(roomName).emit(`team-${teamId}-message`, newMessage);

        console.log(`📨 Mensagem enviada para sala ${roomName}:`);
        console.log(`   De: ${sender?.name} (${userId})`);
        console.log(`   Texto: ${message.substring(0, 50)}...`);

        // TODO: Salvar mensagem no banco de dados
        // await Message.create({
        //   team_id: teamId,
        //   sender_id: userId,
        //   message: message.trim(),
        //   timestamp: new Date()
        // });
      } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error);
        socket.emit('error', {
          message: 'Erro ao enviar mensagem'
        });
      }
    });

    // ──────────────────────────────────────────────────────────────
    // EVENTO: Marcar mensagem como lida
    // ──────────────────────────────────────────────────────────────

    socket.on('mark-as-read', async (data) => {
      try {
        const { teamId, messageId, userId } = data;

        // Validar permissão
        const hasAccess = await checkTeamAccess(teamId, userId);

        if (!hasAccess) {
          return;
        }

        const roomName = `team-${teamId}`;

        // Emitir para todos da sala
        io.to(roomName).emit('message-read', {
          messageId,
          userId,
          timestamp: new Date().toISOString()
        });

        console.log(`👁️ Mensagem ${messageId} marcada como lida na sala ${roomName}`);

        // TODO: Atualizar no banco
        // await Message.update(
        //   { read: true },
        //   { where: { id: messageId, team_id: teamId } }
        // );
      } catch (error) {
        console.error('❌ Erro ao marcar como lida:', error);
      }
    });

    // ──────────────────────────────────────────────────────────────
    // EVENTO: Usuário está digitando
    // ──────────────────────────────────────────────────────────────

    socket.on('typing', (data) => {
      const { teamId, userId, userName, isTyping } = data;
      const roomName = `team-${teamId}`;

      // Emitir para todos EXCETO o remetente
      socket.to(roomName).emit('user-typing', {
        userId,
        userName,
        isTyping,
        timestamp: new Date().toISOString()
      });

      if (isTyping) {
        console.log(`⌨️ ${userName} está digitando na sala ${roomName}`);
      }
    });

    // ──────────────────────────────────────────────────────────────
    // EVENTO: Sair da sala da equipe
    // ──────────────────────────────────────────────────────────────

    socket.on('leave-team', (data) => {
      try {
        const { teamId, userId, userName } = data;
        const roomName = `team-${teamId}`;

        // Sair da sala
        socket.leave(roomName);

        // Remover usuário da lista
        if (roomUsers.has(roomName)) {
          const users = roomUsers.get(roomName);
          const userArray = Array.from(users);
          const updatedUsers = userArray.filter(u => u.socketId !== socket.id);
          
          if (updatedUsers.length > 0) {
            roomUsers.set(roomName, new Set(updatedUsers));
          } else {
            roomUsers.delete(roomName);
          }
        }

        console.log(`👋 Usuário ${userName} (${userId}) saiu da sala ${roomName}`);

        // Notificar outros membros
        socket.to(roomName).emit('user-left', {
          userId,
          userName,
          message: `${userName} saiu da conversa`,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Erro ao sair da sala:', error);
      }
    });

    // ──────────────────────────────────────────────────────────────
    // EVENTO: Desconexão
    // ──────────────────────────────────────────────────────────────

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);

      // Remover usuário de todas as salas
      roomUsers.forEach((users, roomName) => {
        const userArray = Array.from(users);
        const disconnectedUser = userArray.find(u => u.socketId === socket.id);

        if (disconnectedUser) {
          const updatedUsers = userArray.filter(u => u.socketId !== socket.id);
          
          if (updatedUsers.length > 0) {
            roomUsers.set(roomName, new Set(updatedUsers));
          } else {
            roomUsers.delete(roomName);
          }

          // Notificar sala
          socket.to(roomName).emit('user-left', {
            userId: disconnectedUser.userId,
            userName: disconnectedUser.userName,
            message: `${disconnectedUser.userName} desconectou`,
            timestamp: new Date().toISOString()
          });

          console.log(`👋 ${disconnectedUser.userName} removido da sala ${roomName}`);
        }
      });
    });

    // ──────────────────────────────────────────────────────────────
    // EVENTO: Obter usuários online na sala
    // ──────────────────────────────────────────────────────────────

    socket.on('get-online-users', (data) => {
      const { teamId } = data;
      const roomName = `team-${teamId}`;

      const users = roomUsers.has(roomName)
        ? Array.from(roomUsers.get(roomName))
        : [];

      socket.emit('online-users', {
        teamId,
        users: users.map(u => ({
          userId: u.userId,
          userName: u.userName
        })),
        count: users.length
      });

      console.log(`👥 Usuários online na sala ${roomName}: ${users.length}`);
    });
  });

  console.log('✅ Socket.io configurado com isolamento de salas por equipe');

  return io;
};

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO DE USO NO SERVER.JS
// ═══════════════════════════════════════════════════════════════════════

/*
import express from 'express';
import http from 'http';
import { setupSocketIO } from './config/socket-io.js';

const app = express();
const server = http.createServer(app);

// Configurar Socket.io
const io = setupSocketIO(server);

// Tornar io acessível nas rotas
app.set('io', io);

// Ou passar como middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
*/

export default setupSocketIO;
