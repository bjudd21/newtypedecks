#!/usr/bin/env node

/**
 * Environment Setup Script
 *
 * This script helps set up environment variables for the Gundam Card Game project.
 * It can generate secure secrets, validate environment files, and provide setup guidance.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function readEnvFile(filePath) {
  if (!checkFileExists(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};

  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts
          .join('=')
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    }
  });

  return env;
}

function validateRequiredVars(env) {
  const required = [
    'DATABASE_URL',
    'REDIS_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  const missing = required.filter((key) => !env[key]);
  return missing;
}

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const examplePath = path.join(process.cwd(), '.env.example');

  if (checkFileExists(envPath)) {
    log('⚠️  .env file already exists!', 'yellow');
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
        rl.close();
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          copyEnvExample();
          resolve();
        } else {
          log('❌ Operation cancelled.', 'red');
          resolve();
        }
      });
    });
  } else {
    copyEnvExample();
  }
}

function copyEnvExample() {
  const envPath = path.join(process.cwd(), '.env');
  const examplePath = path.join(process.cwd(), '.env.example');

  if (!checkFileExists(examplePath)) {
    log('❌ .env.example file not found!', 'red');
    log('Please create a .env.example file first.', 'yellow');
    return;
  }

  try {
    fs.copyFileSync(examplePath, envPath);
    log('✅ Created .env file from .env.example', 'green');
    log('📝 Please update the values in .env for your environment', 'blue');
  } catch (error) {
    log(`❌ Error creating .env file: ${error.message}`, 'red');
  }
}

function generateSecrets() {
  log('\n🔐 Generating secure secrets...', 'cyan');

  const secrets = {
    NEXTAUTH_SECRET: generateSecret(32),
    JWT_SECRET: generateSecret(32),
    ENCRYPTION_KEY: generateSecret(32),
  };

  log('\nGenerated secrets:', 'bright');
  Object.entries(secrets).forEach(([key, value]) => {
    log(`${key}=${value}`, 'green');
  });

  log(
    '\n⚠️  Keep these secrets secure and never commit them to version control!',
    'yellow'
  );

  return secrets;
}

function validateEnvironment() {
  const envPath = path.join(process.cwd(), '.env');

  if (!checkFileExists(envPath)) {
    log('❌ .env file not found!', 'red');
    log('Run: node scripts/setup-env.js --create', 'blue');
    return;
  }

  log('🔍 Validating environment configuration...', 'cyan');

  const env = readEnvFile(envPath);
  if (!env) {
    log('❌ Error reading .env file', 'red');
    return;
  }

  const missing = validateRequiredVars(env);

  if (missing.length === 0) {
    log('✅ All required environment variables are set!', 'green');
  } else {
    log('❌ Missing required environment variables:', 'red');
    missing.forEach((key) => {
      log(`  - ${key}`, 'red');
    });
    log('\nPlease update your .env file with the missing variables.', 'yellow');
  }

  // Check for common issues
  const issues = [];

  if (
    env.NEXTAUTH_SECRET === 'your-secret-key-here-change-this-in-production'
  ) {
    issues.push('NEXTAUTH_SECRET is using the default value');
  }

  if (env.NODE_ENV === 'production' && env.DATABASE_URL.includes('localhost')) {
    issues.push('Using localhost database URL in production');
  }

  if (issues.length > 0) {
    log('\n⚠️  Potential issues found:', 'yellow');
    issues.forEach((issue) => {
      log(`  - ${issue}`, 'yellow');
    });
  }
}

function showHelp() {
  log('\n🚀 Gundam Card Game - Environment Setup Script', 'bright');
  log('================================================', 'bright');

  log('\nUsage:', 'cyan');
  log('  node scripts/setup-env.js [command]', 'blue');

  log('\nCommands:', 'cyan');
  log('  --create, -c     Create .env file from .env.example', 'blue');
  log('  --validate, -v   Validate current environment configuration', 'blue');
  log('  --secrets, -s    Generate secure secrets', 'blue');
  log('  --help, -h       Show this help message', 'blue');

  log('\nExamples:', 'cyan');
  log('  node scripts/setup-env.js --create', 'blue');
  log('  node scripts/setup-env.js --validate', 'blue');
  log('  node scripts/setup-env.js --secrets', 'blue');

  log('\nFor more information, see docs/ENVIRONMENT_SETUP.md', 'magenta');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case '--create':
    case '-c':
      await createEnvFile();
      break;

    case '--validate':
    case '-v':
      validateEnvironment();
      break;

    case '--secrets':
    case '-s':
      generateSecrets();
      break;

    case '--help':
    case '-h':
    default:
      showHelp();
      break;
  }
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  generateSecret,
  validateEnvironment,
  createEnvFile,
};
