#!/usr/bin/env node

/**
 * Post-install script para garantir que o build é feito
 * Este script roda após npm install e tenta construir o frontend
 * 
 * Estratégia:
 * 1. Verificar Node.js version
 * 2. Verificar se dist já existe
 * 3. Se não existe, tenta construir com npx vite build
 * 4. Se falhar, não quebra o npm install (exit 0)
 */

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🏗️ Post-install: Checando build do frontend...');

// 1. Verificar versão do Node.js
const nodeVersion = process.version;
console.log(`   Node.js: ${nodeVersion}`);

const [major, minor] = nodeVersion.slice(1).split('.').map(Number);
if (major < 20 || (major === 20 && minor < 19)) {
  console.warn('⚠️ Node.js 20.19+ recomendado para Vite v5');
  console.warn(`⚠️ Você tem ${nodeVersion}`);
  // Continuar mesmo assim, o servidor pode tentar depois
}

// 2. Verificar se dist/index.html já existe
const distPath = path.join(rootDir, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath)) {
  console.log('✅ dist/index.html já existe');
  process.exit(0);
}

console.log('⚠️ dist/index.html não encontrado');

// 3. Tentar construir
if (process.env.NODE_ENV === 'production' || process.env.CI) {
  console.log('🏗️ Ambiente: ' + (process.env.NODE_ENV || 'CI'));
  console.log('🏗️ Tentando construir com: npx vite build');
  
  try {
    execSync('npx vite build', { 
      stdio: 'inherit',
      cwd: rootDir,
      timeout: 120000 // 2 minutos timeout
    });
    
    if (fs.existsSync(indexPath)) {
      console.log('✅ Build concluído com sucesso!');
      process.exit(0);
    } else {
      throw new Error('dist/index.html não foi criado');
    }
  } catch (error) {
    console.error('❌ Erro ao construir:', error.message);
    console.warn('⚠️ Build será tentado novamente ao iniciar servidor');
    process.exit(0); // Não quebra npm install
  }
} else {
  console.log('⚠️ NODE_ENV !== production, skip build');
  process.exit(0);
}
