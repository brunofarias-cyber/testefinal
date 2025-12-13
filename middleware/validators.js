import { body, param, validationResult } from 'express-validator';

// ===== VALIDADORES =====

export const validateGrade = [
  body('studentId')
    .isInt({ min: 1 })
    .withMessage('ID do aluno deve ser um número positivo'),
  body('grade')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Nota deve estar entre 0 e 10'),
  body('rubricId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID da rubrica deve ser um número')
];

export const validateAttendance = [
  body('studentId')
    .isInt({ min: 1 })
    .withMessage('ID do aluno deve ser um número positivo'),
  body('status')
    .isIn(['present', 'absent', 'late'])
    .withMessage('Status deve ser: present, absent ou late'),
  body('date')
    .isISO8601()
    .withMessage('Data deve estar em formato ISO 8601')
];

export const validateSubmission = [
  body('studentId')
    .isInt({ min: 1 })
    .withMessage('ID do aluno deve ser um número positivo'),
  body('activityId')
    .isInt({ min: 1 })
    .withMessage('ID da atividade deve ser um número positivo'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Conteúdo não pode estar vazio')
];

export const validateRubric = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome da rubrica é obrigatório'),
  body('criteria')
    .isArray({ min: 1 })
    .withMessage('Rubrica deve ter pelo menos um critério'),
  body('criteria.*.name')
    .trim()
    .notEmpty()
    .withMessage('Nome do critério é obrigatório'),
  body('criteria.*.points')
    .isInt({ min: 1, max: 100 })
    .withMessage('Pontos do critério deve estar entre 1 e 100')
];

export const validateCommunication = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Conteúdo do comunicado é obrigatório')
    .isLength({ max: 500 })
    .withMessage('Comunicado não pode exceder 500 caracteres'),
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('Deve haver pelo menos um destinatário'),
  body('recipients.*')
    .isIn(['all', 'students', 'teachers', 'class'])
    .withMessage('Tipo de destinatário inválido')
];

export const validateUser = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório'),
  body('role')
    .isIn(['student', 'teacher', 'coordinator', 'admin'])
    .withMessage('Papel de usuário inválido')
];

// ===== MIDDLEWARE DE ERRO DE VALIDAÇÃO =====

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validação falhou',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

// ===== MIDDLEWARE DE SANITIZAÇÃO =====

export const sanitizeInputs = (req, res, next) => {
  // Remove XSS attempts
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, '')
          .trim();
      }
    });
  }
  next();
};
