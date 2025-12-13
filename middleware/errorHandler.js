import logger from '../utils/logger.js';

// ===== CLASSE DE ERRO CUSTOMIZADO =====

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

// ===== MIDDLEWARE DE ERRO GLOBAL =====

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  // Log do erro
  logger.error('Erro na requisição', {
    method: req.method,
    path: req.path,
    statusCode,
    message,
    stack: err.stack,
    body: req.body,
    user: req.user?.id || 'anonymous'
  });
  
  // Resposta ao cliente
  res.status(statusCode).json({
    status: 'error',
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details
    })
  });
};

// ===== MIDDLEWARE DE ERRO NÃO ENCONTRADO =====

export const notFoundHandler = (req, res) => {
  const error = new AppError(
    `Rota não encontrada: ${req.method} ${req.path}`,
    404
  );
  
  logger.warn('Rota não encontrada', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
    statusCode: 404,
    path: req.path,
    method: req.method
  });
};

// ===== WRAPPER PARA TRY-CATCH =====

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ===== VALIDAÇÃO DE AUTENTICAÇÃO =====

export const validateAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token de autenticação obrigatório',
      statusCode: 401
    });
  }
  
  next();
};

// ===== VALIDAÇÃO DE AUTORIZAÇÃO =====

export const validateRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      logger.warn('Acesso não autorizado', {
        userId: req.user?.id,
        userRole,
        requiredRoles: allowedRoles,
        path: req.path
      });
      
      return res.status(403).json({
        status: 'error',
        message: 'Permissão negada',
        statusCode: 403
      });
    }
    
    next();
  };
};

// ===== TRATAMENTO DE TIMEOUT =====

export const timeoutHandler = (timeout = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      const error = new AppError('Requisição expirou', 408);
      next(error);
    }, timeout);
    
    res.on('finish', () => clearTimeout(timer));
    next();
  };
};
