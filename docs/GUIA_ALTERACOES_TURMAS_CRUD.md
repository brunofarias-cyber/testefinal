# 📚 GUIA COMPLETO: IMPLEMENTAÇÃO DAS ROTAS BACKEND

Este guia mostra como implementar as 6 rotas necessárias para o CRUD completo de turmas.

---

## 📡 ROTAS A IMPLEMENTAR

### 1. GET `/api/classes` - Obter todas as turmas do professor
### 2. GET `/api/classes/:id` - Obter turma específica
### 3. POST `/api/classes` - Criar nova turma
### 4. PUT `/api/classes/:id` - **Editar turma (NOVO)**
### 5. POST `/api/classes/:id/students` - **Adicionar aluno à turma (NOVO)**
### 6. DELETE `/api/classes/:id/students/:studentId` - **Remover aluno da turma (NOVO)**
### 7. DELETE `/api/classes/:id` - Deletar turma

---

## 🔧 CÓDIGO BACKEND (Node.js + Express + Sequelize)

### ARQUIVO: `routes/classes.js`

```javascript
import express from 'express';
import { Class, Student } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// 1. GET - Obter todas as turmas do professor
// ============================================
router.get('/', authenticate, async (req, res) => {
  try {
    const classes = await Class.findAll({
      where: { teacherId: req.user.id },
      include: [{ 
        model: Student, 
        as: 'students',
        through: { attributes: ['joinDate'] }
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 2. GET - Obter turma por ID
// ============================================
router.get('/:id', authenticate, async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id, {
      include: [{ 
        model: Student, 
        as: 'students',
        through: { attributes: ['joinDate'] }
      }]
    });
    
    if (!classItem) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    // Verificar se a turma pertence ao professor logado
    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    res.json(classItem);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 3. POST - Criar nova turma
// ============================================
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, year, description, totalCapacity } = req.body;
    
    // Validações
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome da turma é obrigatório' });
    }
    if (!year || !year.trim()) {
      return res.status(400).json({ error: 'Ano/Série é obrigatório' });
    }
    
    const newClass = await Class.create({
      name: name.trim(),
      year: year.trim(),
      description: description?.trim() || '',
      totalCapacity: totalCapacity || 35,
      teacherId: req.user.id
    });
    
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 4. PUT - EDITAR TURMA (mudar nome, ano, descrição)
// ============================================
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, year, description, totalCapacity } = req.body;
    
    const classItem = await Class.findByPk(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    // Verificar se a turma pertence ao professor logado
    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Validações
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ error: 'Nome da turma não pode ser vazio' });
    }
    if (year !== undefined && !year.trim()) {
      return res.status(400).json({ error: 'Ano/Série não pode ser vazio' });
    }
    
    // Atualizar apenas os campos fornecidos
    await classItem.update({
      name: name?.trim() || classItem.name,
      year: year?.trim() || classItem.year,
      description: description !== undefined ? description.trim() : classItem.description,
      totalCapacity: totalCapacity || classItem.totalCapacity
    });
    
    // Recarregar com alunos
    const updatedClass = await Class.findByPk(req.params.id, {
      include: [{ 
        model: Student, 
        as: 'students',
        through: { attributes: ['joinDate'] }
      }]
    });
    
    res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 5. POST - ADICIONAR ALUNO À TURMA
// ============================================
router.post('/:id/students', authenticate, async (req, res) => {
  try {
    const { studentId } = req.body;
    
    if (!studentId) {
      return res.status(400).json({ error: 'studentId é obrigatório' });
    }
    
    const classItem = await Class.findByPk(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    // Verificar se a turma pertence ao professor logado
    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const student = await Student.findByPk(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    // Verificar se aluno já está na turma
    const alreadyInClass = await classItem.hasStudent(student);
    if (alreadyInClass) {
      return res.status(400).json({ error: 'Aluno já está matriculado nesta turma' });
    }
    
    // Adicionar aluno à turma (many-to-many)
    await classItem.addStudent(student, {
      through: { joinDate: new Date() }
    });
    
    res.json({
      id: student.id,
      name: student.name,
      email: student.email,
      joinDate: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error adding student to class:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 6. DELETE - REMOVER ALUNO DA TURMA
// ============================================
router.delete('/:classId/students/:studentId', authenticate, async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.classId);
    
    if (!classItem) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    // Verificar se a turma pertence ao professor logado
    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const student = await Student.findByPk(req.params.studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    // Remover associação (many-to-many)
    await classItem.removeStudent(student);
    
    res.json({ success: true, message: 'Aluno removido da turma com sucesso' });
  } catch (error) {
    console.error('Error removing student from class:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 7. DELETE - Deletar turma inteira
// ============================================
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    // Verificar se a turma pertence ao professor logado
    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Deletar turma (Sequelize remove vínculos automaticamente se CASCADE estiver configurado)
    await classItem.destroy();
    
    res.json({ success: true, message: 'Turma deletada com sucesso' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## 📝 REGISTRAR AS ROTAS NO `server.js`

```javascript
import classesRoutes from './routes/classes.js';

// ... outras importações ...

app.use('/api/classes', classesRoutes);
```

---

## 🗄️ MODELO SEQUELIZE (Caso precise criar)

### `models/Class.js`

```javascript
import { DataTypes } from 'sequelize';

export const ClassModel = (sequelize) => {
  const Class = sequelize.define('Class', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Ano/Série (ex: 1º Ano, 2º Médio)'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    totalCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 35
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'classes',
    timestamps: true
  });

  return Class;
};
```

### Associações no `models/index.js`

```javascript
Class.belongsToMany(Student, {
  through: 'ClassStudents',
  as: 'students',
  foreignKey: 'classId'
});

Student.belongsToMany(Class, {
  through: 'ClassStudents',
  as: 'classes',
  foreignKey: 'studentId'
});

Class.belongsTo(User, { 
  as: 'teacher', 
  foreignKey: 'teacherId' 
});
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### BACKEND:
- [ ] Criar arquivo `routes/classes.js`
- [ ] Copiar código das 7 rotas
- [ ] Registrar rotas em `server.js`
- [ ] Verificar modelo `Class` tem campo `year`
- [ ] Configurar associações many-to-many
- [ ] Testar cada rota com Postman
- [ ] Implementar middleware `authenticate`
- [ ] Adicionar validações de entrada

### FRONTEND:
- [ ] ✅ Componente `TeacherClassManager.jsx` já criado
- [ ] ✅ Integrado no `App.jsx`
- [ ] Testar fluxo completo
- [ ] Verificar mensagens de erro
- [ ] Testar responsividade

### BANCO DE DADOS:
- [ ] Fazer migration para adicionar campo `year`
- [ ] Verificar tabela `ClassStudents` existe
- [ ] Testar constraint CASCADE DELETE

---

## 🧪 TESTE COM POSTMAN

### 1. Editar Turma
```http
PUT http://localhost:3000/api/classes/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "1º Ano A - Atualizado",
  "year": "1º Ano",
  "description": "Turma matutino - 2024"
}
```

**Resposta esperada:**
```json
{
  "id": 1,
  "name": "1º Ano A - Atualizado",
  "year": "1º Ano",
  "description": "Turma matutino - 2024",
  "totalCapacity": 35,
  "teacherId": 5,
  "students": [...]
}
```

### 2. Adicionar Aluno
```http
POST http://localhost:3000/api/classes/1/students
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "studentId": 101
}
```

**Resposta esperada:**
```json
{
  "id": 101,
  "name": "João Silva",
  "email": "joao.silva@school.com",
  "joinDate": "2024-12-07"
}
```

### 3. Remover Aluno
```http
DELETE http://localhost:3000/api/classes/1/students/101
Authorization: Bearer YOUR_TOKEN
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Aluno removido da turma com sucesso"
}
```

---

## 🔐 MIDDLEWARE DE AUTENTICAÇÃO

Certifique-se de ter o middleware `authenticate`:

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

---

## 🐛 TROUBLESHOOTING

### Erro: "year is not defined"
**Solução:** Fazer migration para adicionar coluna `year`

```sql
ALTER TABLE classes ADD COLUMN year VARCHAR(50);
```

### Erro: "Cannot read property 'addStudent'"
**Solução:** Verificar associações many-to-many no `models/index.js`

### Erro: "Turma não encontrada" mas existe
**Solução:** Verificar `teacherId` corresponde ao usuário logado

---

## 🎉 PRONTO!

Todas as rotas necessárias estão implementadas. Agora você pode:
1. Testar com Postman
2. Integrar com frontend
3. Fazer deploy em produção

🚀 **Boa sorte!**
