import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar pasta de logs se não existir
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ===== LOGGER SIMPLES (sem dependências) =====

class Logger {
  constructor() {
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    this.currentLevel = process.env.LOG_LEVEL || 'info';
  }

  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const dataStr = Object.keys(data).length ? JSON.stringify(data) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${dataStr}`.trim();
  }

  shouldLog(level) {
    return this.logLevels[level] <= this.logLevels[this.currentLevel];
  }

  writeToFile(filename, message) {
    const filepath = path.join(logsDir, filename);
    fs.appendFileSync(filepath, message + '\n', { encoding: 'utf8' });
  }

  log(level, message, data = {}) {
    if (!this.shouldLog(level)) return;

    const formatted = this.formatMessage(level, message, data);

    // Console output
    const colors = {
      error: '\x1b[31m',    // Vermelho
      warn: '\x1b[33m',     // Amarelo
      info: '\x1b[36m',     // Cyan
      debug: '\x1b[35m'     // Magenta
    };
    const reset = '\x1b[0m';

    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors[level]}${formatted}${reset}`);
    }

    // File output
    this.writeToFile('combined.log', formatted);
    if (level === 'error') {
      this.writeToFile('error.log', formatted);
    }
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }
}

export default new Logger();
