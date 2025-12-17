#!/usr/bin/env node

/**
 * Post-install script para garantir que o build é feito
 * Este script roda após npm install e tenta construir o frontend
 */

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️ Post-install: Verificando se dist/ precisa ser construído...');

// Verificar versão do Node.js
const nodeVersion = process.version;
console.log(`   Node.js version: ${nodeVersion}`);

const majorMinor = nodeVersion.split('.').slice(0, 2).join('.');
if (majorMinor === 'v20' && parseInt(nodeVersion.split('.')[1]) < 19) {
  console.error('❌ Node.js 20.19+ é obrigatório para Vite v5');
  console.error(`❌ Você está usando ${nodeVersion}`);
  process.exit(1);
}

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath)) {
  console.log('✅ dist/index.html já existe, pulando build');
  process.exit(0);
}

console.log('⚠️ dist/index.html não encontrado, construindo...');

try {
  console.log('🏗️ Executando: npm run build:render');
  execSync('npm run build:render', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Build concluído com sucesso!');
  
  // Verificar se realmente foi criado
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html não foi criado após build');
  }
  
  process.exit(0);
} catch (error) {
  console.error('❌ Erro ao construir dist:', error.message);
  console.error('⚠️ Build será tentado novamente ao iniciar o servidor');
  process.exit(0); // Não falhar o npm install
}
