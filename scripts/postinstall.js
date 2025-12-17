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

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath)) {
  console.log('✅ dist/index.html já existe, pulando build');
  process.exit(0);
}

console.log('⚠️ dist/index.html não encontrado, tentando construir...');

try {
  console.log('🏗️ Executando: npm run build:render');
  execSync('npm run build:render', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Build concluído com sucesso!');
  process.exit(0);
} catch (error) {
  console.error('❌ Erro ao construir dist:', error.message);
  console.error('⚠️ Build será tentado novamente ao iniciar o servidor');
  process.exit(0); // Não falhar o npm install
}
