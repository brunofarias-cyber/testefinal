#!/usr/bin/env node

/**
 * Script de Teste para AI Service
 * 
 * Uso:
 *   node backend/scripts/test-ai-service.js
 * 
 * Este script testa o serviço de IA sem precisar de um servidor completo
 */

import { generateAISuggestion, getAIStatus } from '../services/aiService.js';

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║          🤖 TESTE DO SERVIÇO DE IA - WIZARD BNCC            ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// ═══════════════════════════════════════════════════════════════════════
// 1. VERIFICAR STATUS
// ═══════════════════════════════════════════════════════════════════════

console.log('📊 Status da IA:\n');
const status = getAIStatus();
console.log('Configured:', status.configured);
console.log('Current Provider:', status.current);
console.log('Providers:');
Object.entries(status.providers).forEach(([provider, state]) => {
  const icon = state === 'ativo' ? '✅' : '⚫';
  console.log(`  ${icon} ${provider}: ${state}`);
});
console.log();

// ═══════════════════════════════════════════════════════════════════════
// 2. TESTAR GERAÇÃO
// ═══════════════════════════════════════════════════════════════════════

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('🧪 Testando geração de sugestão...\n');

const input = {
  tema: 'Horta Sustentável na Escola',
  area: 'Ciências da Natureza',
  habilidades: [
    'Investigar a influência da biosfera nas transformações do planeta',
    'Analisar e interpretar diferentes tipos de transformações químicas',
    'Compreender o papel dos microrganismos na fermentação',
  ],
};

console.log('📋 Input:');
console.log(`   Tema: ${input.tema}`);
console.log(`   Área: ${input.area}`);
console.log(`   Habilidades: ${input.habilidades.length}`);
console.log();

try {
  const start = Date.now();
  const sugestao = await generateAISuggestion(input);
  const duration = Date.now() - start;

  console.log(`✅ Sugestão gerada com sucesso!\n`);
  console.log(`Provider: ${sugestao.provider}`);
  console.log(`Tempo: ${duration}ms\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📌 JUSTIFICATIVA:\n');
  console.log(sugestao.justificativa);
  console.log();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🎯 OBJETIVOS ESPECÍFICOS:\n');
  console.log(sugestao.objetivosEspecificos);
  console.log();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🚀 ATIVIDADES INICIAIS:\n');
  console.log(sugestao.atividadesIniciais);
  console.log();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('✨ Teste concluído com sucesso!\n');
  console.log('Próximos passos:');
  console.log('1. Se estava usando mock, teste com uma API real');
  console.log('2. Integre no frontend (ProjectWizard.jsx)');
  console.log('3. Configure rate limiting em produção');
  console.log();

  process.exit(0);
} catch (error) {
  console.error('❌ Erro ao gerar sugestão:', error.message);
  console.log();
  console.log('Dicas de troubleshooting:');
  console.log('1. Verificar se as variáveis de ambiente estão corretas');
  console.log('2. Testar conexão com a IA API');
  console.log('3. Verificar se a chave de API tem permissões');
  console.log();
  process.exit(1);
}
