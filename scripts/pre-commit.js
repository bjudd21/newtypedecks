#!/usr/bin/env node

/**
 * Pre-commit Hook Script
 * 
 * This script runs quality checks before commits to ensure code quality standards.
 * It enforces linting, formatting, type checking, and file size limits.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bright: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔧 ${description}...`, 'cyan');
  
  try {
    const output = execSync(command, { 
      stdio: 'pipe',
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    log(`✅ ${description} passed`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    log(error.stdout || error.message, 'red');
    return { success: false, error: error.stdout || error.message };
  }
}

function checkStagedFiles() {
  log('\n📋 Checking staged files...', 'cyan');
  
  try {
    const stagedFiles = execSync('git diff --cached --name-only', { 
      encoding: 'utf8' 
    }).trim().split('\n').filter(Boolean);
    
    if (stagedFiles.length === 0) {
      log('No staged files to check', 'yellow');
      return [];
    }
    
    log(`Found ${stagedFiles.length} staged files:`, 'blue');
    stagedFiles.forEach(file => {
      log(`  • ${file}`, 'blue');
    });
    
    return stagedFiles;
  } catch (error) {
    log(`Error checking staged files: ${error.message}`, 'red');
    return [];
  }
}

function checkFileTypes(files) {
  const allowedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yml', '.yaml'];
  const configFiles = ['.gitignore', '.env.example', 'package.json', 'package-lock.json'];
  
  const invalidFiles = files.filter(file => {
    const ext = path.extname(file);
    const isConfigFile = configFiles.includes(path.basename(file));
    return !allowedExtensions.includes(ext) && !isConfigFile;
  });
  
  if (invalidFiles.length > 0) {
    log('\n⚠️  Warning: Some files may not be checked:', 'yellow');
    invalidFiles.forEach(file => {
      log(`  • ${file}`, 'yellow');
    });
  }
  
  return invalidFiles;
}

function runQualityChecks() {
  log('\n🚀 Running pre-commit quality checks...', 'bright');
  log('=' .repeat(50), 'blue');
  
  const results = {
    passed: 0,
    failed: 0,
    checks: []
  };
  
  // 1. Type checking
  const typeCheck = runCommand('npm run type-check', 'TypeScript type checking');
  results.checks.push({ name: 'Type Check', success: typeCheck.success });
  if (typeCheck.success) results.passed++; else results.failed++;
  
  // 2. Linting
  const lint = runCommand('npm run lint', 'ESLint code quality check');
  results.checks.push({ name: 'Linting', success: lint.success });
  if (lint.success) results.passed++; else results.failed++;
  
  // 3. Code formatting check
  const formatCheck = runCommand('npm run format:check', 'Prettier formatting check');
  results.checks.push({ name: 'Format Check', success: formatCheck.success });
  if (formatCheck.success) results.passed++; else results.failed++;
  
  // 4. File size check
  const fileSizeCheck = runCommand('node scripts/check-file-sizes.js --check', 'File size monitoring');
  results.checks.push({ name: 'File Size Check', success: fileSizeCheck.success });
  if (fileSizeCheck.success) results.passed++; else results.failed++;
  
  // 5. Tests (optional - can be skipped for faster commits)
  const runTests = process.env.PRE_COMMIT_RUN_TESTS === 'true';
  if (runTests) {
    const tests = runCommand('npm run test:ci', 'Unit tests');
    results.checks.push({ name: 'Tests', success: tests.success });
    if (tests.success) results.passed++; else results.failed++;
  } else {
    log('\n⏭️  Skipping tests (set PRE_COMMIT_RUN_TESTS=true to enable)', 'yellow');
    results.checks.push({ name: 'Tests', success: true, skipped: true });
    results.passed++;
  }
  
  return results;
}

function displayResults(results) {
  log('\n📊 Pre-commit Check Results:', 'blue');
  log('=' .repeat(50), 'blue');
  
  results.checks.forEach(check => {
    const status = check.success ? '✅' : '❌';
    const statusColor = check.success ? 'green' : 'red';
    const skipped = check.skipped ? ' (skipped)' : '';
    
    log(`${status} ${check.name}${skipped}`, statusColor);
  });
  
  log(`\n📈 Summary:`, 'cyan');
  log(`  ✅ Passed: ${results.passed}`, 'green');
  log(`  ❌ Failed: ${results.failed}`, 'red');
  
  if (results.failed > 0) {
    log(`\n💡 To fix issues:`, 'yellow');
    log(`  • Run 'npm run lint:fix' to auto-fix linting issues`, 'yellow');
    log(`  • Run 'npm run format' to auto-fix formatting issues`, 'yellow');
    log(`  • Fix TypeScript errors manually`, 'yellow');
    log(`  • Refactor large files to meet size limits`, 'yellow');
    log(`  • Run 'npm run check' to run all checks locally`, 'yellow');
  }
}

function main() {
  log('🔒 Pre-commit Hook', 'bright');
  log('==================', 'bright');
  
  // Check if we're in a git repository
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
  } catch (error) {
    log('❌ Not in a git repository', 'red');
    process.exit(1);
  }
  
  // Check staged files
  const stagedFiles = checkStagedFiles();
  if (stagedFiles.length === 0) {
    log('No staged files to check', 'yellow');
    process.exit(0);
  }
  
  // Check file types
  checkFileTypes(stagedFiles);
  
  // Run quality checks
  const results = runQualityChecks();
  
  // Display results
  displayResults(results);
  
  // Exit with appropriate code
  if (results.failed > 0) {
    log('\n❌ Pre-commit checks failed!', 'red');
    log('Please fix the issues above before committing.', 'red');
    process.exit(1);
  } else {
    log('\n✅ Pre-commit checks passed!', 'green');
    log('Proceeding with commit...', 'green');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  runQualityChecks,
  checkStagedFiles,
  checkFileTypes,
};
