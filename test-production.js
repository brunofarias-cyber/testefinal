#!/usr/bin/env node

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
let passed = 0;
let failed = 0;

async function test(name, method, endpoint, data, expectedStatus) {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      validateStatus: () => true
    });

    const success = response.status === expectedStatus;
    const symbol = success ? '✅' : '❌';
    console.log(`${symbol} ${name}`);
    
    if (!success) {
      console.log(`   Expected: ${expectedStatus}, Got: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(response.data).substring(0, 100));
      failed++;
    } else {
      passed++;
    }
  } catch (error) {
    console.log(`❌ ${name} - ${error.message}`);
    failed++;
  }
}

async function runTests() {
  console.log('🧪 Iniciando testes de validação...\n');

  // Teste 1: Health Check
  await test('Health Check', 'GET', '/api/health', null, 200);

  // Teste 2: Grade - Inválido (> 10)
  await test(
    'Grade: Rejeitar nota > 10',
    'POST',
    '/api/grades/create',
    { studentId: '1', grade: 15, projectId: '1', feedback: 'test' },
    400
  );

  // Teste 3: Grade - Válido
  await test(
    'Grade: Aceitar nota válida (5)',
    'POST',
    '/api/grades/create',
    { studentId: '1', grade: 5, projectId: '1', feedback: 'bom' },
    201
  );

  // Teste 4: Attendance - Status Inválido
  await test(
    'Attendance: Rejeitar status inválido',
    'POST',
    '/api/attendance/mark',
    { studentId: '1', classId: '1', className: 'Math', status: 'invalid', teacherName: 'João' },
    400
  );

  // Teste 5: Attendance - Status Válido
  await test(
    'Attendance: Aceitar status válido (presente)',
    'POST',
    '/api/attendance/mark',
    { studentId: '1', classId: '1', className: 'Math', status: 'presente', teacherName: 'João' },
    201
  );

  // Teste 6: Messages - Message muito longo
  await test(
    'Message: Rejeitar mensagem > 500 chars',
    'POST',
    '/api/messages/send',
    {
      conversationId: '1',
      senderId: '1',
      message: 'x'.repeat(501),
      senderRole: 'student'
    },
    400
  );

  // Teste 7: Messages - Válido
  await test(
    'Message: Aceitar mensagem válida',
    'POST',
    '/api/messages/send',
    {
      conversationId: '1',
      senderId: '1',
      message: 'Olá!',
      senderRole: 'student'
    },
    201
  );

  // Teste 8: Submissions - File size inválido (> 50MB)
  await test(
    'Submission: Rejeitar fileSize > 50MB',
    'POST',
    '/api/submissions/upload',
    {
      fileSize: 52428800, // 50MB + 1
      fileName: 'test.pdf',
      studentId: '1',
      projectId: '1'
    },
    400
  );

  // Teste 9: Rubrics - Título vazio (validação)
  await test(
    'Rubric: Rejeitar rubrica sem título',
    'POST',
    '/api/rubricas',
    {
      projetoId: '1',
      titulo: '',
      descricao: 'Test Description',
      criterios: [{ nome: 'Criterion 1', peso: 50 }]
    },
    400
  );

  console.log(`\n📊 Resultados: ${passed} passaram ✅, ${failed} falharam ❌`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
