import rateLimit from 'express-rate-limit';

// ===== RATE LIMITERS =====

// Limiter global - 100 requisições por 15 minutos
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Pular verificação para health check
    return req.path === '/api/health';
  }
});

// Limiter para autenticação - mais rigoroso
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  skipSuccessfulRequests: true, // Não contar requisições bem-sucedidas
  standardHeaders: true,
  legacyHeaders: false
});

// Limiter para criação de recursos
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30, // 30 requisições por hora
  message: 'Limite de criação de recursos atingido',
  standardHeaders: true,
  legacyHeaders: false
});

// Limiter para upload
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 uploads por hora
  message: 'Limite de uploads atingido',
  standardHeaders: true,
  legacyHeaders: false
});

// Limiter para API pública
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50,
  message: 'Limite de requisições de API atingido',
  standardHeaders: true,
  legacyHeaders: false
});

// Limiter para comunicações (evitar spam)
export const communicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // 20 comunicados por hora
  message: 'Limite de comunicados atingido',
  standardHeaders: true,
  legacyHeaders: false
});

// Limiter customizado por usuário (usando token)
export const userLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 60 * 60 * 1000,
    max: options.max || 50,
    keyGenerator: (req) => {
      // Usar ID do usuário se estiver autenticado, senão usar IP
      return req.user?.id || req.ip;
    },
    message: options.message || 'Limite de requisições atingido',
    standardHeaders: true,
    legacyHeaders: false
  });
};
