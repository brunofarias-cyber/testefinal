import express from 'express';
const router = express.Router();

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ROTAS DE GESTÃO DE TURMAS (CRUD COMPLETO)
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Endpoints:
 * - GET    /api/classes                    - Listar todas as turmas
 * - GET    /api/classes/:id                - Obter uma turma específica
 * - POST   /api/classes                    - Criar nova turma
 * - PUT    /api/classes/:id                - Editar turma
 * - DELETE /api/classes/:id                - Deletar turma
 * - GET    /api/classes/:id/students       - Listar estudantes de uma turma
 * - POST   /api/classes/:id/students       - Adicionar estudante à turma
 * - DELETE /api/classes/:id/students/:sid  - Remover estudante da turma
 */

// ═══════════════════════════════════════════════════════════════════════
// GET /api/classes - Listar todas as turmas
// ═══════════════════════════════════════════════════════════════════════

router.get('/', async (req, res) => {
  try {
    const { teacherId } = req.query;

    // TODO: Substituir por query real no banco
    // const classes = await Class.findAll({
    //   where: teacherId ? { teacherId } : {},
    //   include: [{ model: Student }]
    // });

    // Mock fallback
    const mockClasses = [
      {
        id: 1,
        name: '1º Ano A',
        year: '1º ano',
        teacherId: 1,
        students: [
          { id: 101, name: 'João Silva', email: 'joao@school.com' },
          { id: 102, name: 'Maria Santos', email: 'maria@school.com' }
        ],
        engagement: 85,
        theme: 'blue',
        createdAt: new Date()
      },
      {
        id: 2,
        name: '2º Ano B',
        year: '2º ano',
        teacherId: 1,
        students: [
          { id: 103, name: 'Pedro Costa', email: 'pedro@school.com' },
          { id: 104, name: 'Ana Costa', email: 'ana@school.com' }
        ],
        engagement: 78,
        theme: 'purple',
        createdAt: new Date()
      }
    ];

    res.json({
      success: true,
      data: mockClasses,
      count: mockClasses.length
    });
  } catch (error) {
    console.error('Erro ao listar turmas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar turmas'
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/classes/:id - Obter uma turma específica
// ═══════════════════════════════════════════════════════════════════════

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Substituir por query real no banco
    // const classData = await Class.findByPk(id, {
    //   include: [{ model: Student }]
    // });

    // Mock fallback
    const mockClass = {
      id: parseInt(id),
      name: '1º Ano A',
      year: '1º ano',
      teacherId: 1,
      students: [
        { 
          id: 101, 
          name: 'João Silva', 
          email: 'joao@school.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao'
        },
        { 
          id: 102, 
          name: 'Maria Santos', 
          email: 'maria@school.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
        }
      ],
      engagement: 85,
      theme: 'blue',
      createdAt: new Date()
    };

    res.json({
      success: true,
      data: mockClass
    });
  } catch (error) {
    console.error('Erro ao obter turma:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter turma'
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/classes - Criar nova turma
// ═══════════════════════════════════════════════════════════════════════

router.post('/', async (req, res) => {
  try {
    const { name, year, teacherId, theme } = req.body;

    // Validação
    if (!name || !year) {
      return res.status(400).json({
        success: false,
        error: 'Nome e ano são obrigatórios'
      });
    }

    // TODO: Substituir por criação real no banco
    // const newClass = await Class.create({
    //   name,
    //   year,
    //   teacherId,
    //   theme: theme || 'blue'
    // });

    // Mock response
    const newClass = {
      id: Date.now(),
      name,
      year,
      teacherId: teacherId || 1,
      theme: theme || 'blue',
      students: [],
      engagement: 0,
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Turma criada com sucesso',
      data: newClass
    });
  } catch (error) {
    console.error('Erro ao criar turma:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar turma'
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// PUT /api/classes/:id - Editar turma
// ═══════════════════════════════════════════════════════════════════════

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, theme } = req.body;

    // Validação
    if (!name && !year && !theme) {
      return res.status(400).json({
        success: false,
        error: 'Forneça pelo menos um campo para atualizar'
      });
    }

    // TODO: Substituir por update real no banco
    // const classData = await Class.findByPk(id);
    // if (!classData) {
    //   return res.status(404).json({
    //     success: false,
    //     error: 'Turma não encontrada'
    //   });
    // }
    // 
    // await classData.update({ name, year, theme });

    // Mock response
    const updatedClass = {
      id: parseInt(id),
      name: name || '1º Ano A',
      year: year || '1º ano',
      theme: theme || 'blue',
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Turma atualizada com sucesso',
      data: updatedClass
    });
  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar turma'
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// DELETE /api/classes/:id - Deletar turma
// ═══════════════════════════════════════════════════════════════════════

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Substituir por delete real no banco
    // const classData = await Class.findByPk(id);
    // if (!classData) {
    //   return res.status(404).json({
    //     success: false,
    //     error: 'Turma não encontrada'
    //   });
    // }
    // 
    // await classData.destroy();

    res.json({
      success: true,
      message: 'Turma deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar turma:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar turma'
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/classes/:id/students - Listar estudantes de uma turma
// ═══════════════════════════════════════════════════════════════════════

router.get('/:id/students', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Substituir por query real no banco
    // const students = await Student.findAll({
    //   where: { classId: id }
    // });

    // Mock fallback
    const mockStudents = [
      { 
        id: 101, 
        name: 'João Silva', 
        email: 'joao@school.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
        classId: parseInt(id)
      },
      { 
        id: 102, 
        name: 'Maria Santos', 
        email: 'maria@school.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        classId: parseInt(id)
      }
    ];

    res.json({
      success: true,
      data: mockStudents,
      count: mockStudents.length
    });
  } catch (error) {
    console.error('Erro ao listar estudantes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar estudantes'
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/classes/:id/students - Adicionar estudante à turma
// ═══════════════════════════════════════════════════════════════════════

router.post('/:id/students', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Validação
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Nome e email são obrigatórios'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // TODO: Substituir por criação real no banco
    // const existingStudent = await Student.findOne({
    //   where: { email, classId: id }
    // });
    // 
    // if (existingStudent) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'Email já cadastrado nesta turma'
    //   });
    // }
    // 
    // const newStudent = await Student.create({
    //   name,
    //   email,
    //   classId: id,
    //   avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    // });

    // Mock response
    const newStudent = {
      id: Date.now(),
      name,
      email,
      classId: parseInt(id),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: `${name} adicionado(a) à turma`,
      student: newStudent
    });
  } catch (error) {
    console.error('Erro ao adicionar estudante:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar estudante'
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// DELETE /api/classes/:id/students/:studentId - Remover estudante da turma
// ═══════════════════════════════════════════════════════════════════════

router.delete('/:id/students/:studentId', async (req, res) => {
  try {
    const { id, studentId } = req.params;

    // TODO: Substituir por delete real no banco
    // const student = await Student.findOne({
    //   where: { id: studentId, classId: id }
    // });
    // 
    // if (!student) {
    //   return res.status(404).json({
    //     success: false,
    //     error: 'Estudante não encontrado nesta turma'
    //   });
    // }
    // 
    // await student.destroy();

    res.json({
      success: true,
      message: 'Estudante removido da turma'
    });
  } catch (error) {
    console.error('Erro ao remover estudante:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover estudante'
    });
  }
});

export default router;
