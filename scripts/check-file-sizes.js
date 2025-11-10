#!/usr/bin/env node

/**
 * File Size Monitoring Script
 *
 * This script checks file sizes and enforces size limits to maintain code quality.
 * It helps prevent files from becoming too large and difficult to maintain.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
  // File size limits (in lines)
  limits: {
    'src/**/*.ts': 300,
    'src/**/*.tsx': 300,
    'src/**/*.js': 300,
    'src/**/*.jsx': 300,
    'src/**/*.test.ts': 500,
    'src/**/*.test.tsx': 500,
    'src/**/*.spec.ts': 500,
    'src/**/*.spec.tsx': 500,
  },

  // Files to ignore
  ignore: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'coverage/**',
    '*.config.js',
    '*.config.mjs',
    '*.config.ts',
    'scripts/**',
    'docs/**',
    'prisma/migrations/**',
  ],

  // Warning threshold (percentage of limit)
  warningThreshold: 0.8,

  // Error threshold (percentage of limit)
  errorThreshold: 1.0,
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getFileLineCount(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatFileSize(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

function checkFileSizes() {
  log('\n🔍 Checking file sizes...', 'cyan');

  const results = {
    passed: 0,
    warnings: 0,
    errors: 0,
    files: [],
  };

  // Check each pattern
  Object.entries(CONFIG.limits).forEach(([pattern, limit]) => {
    const files = glob.sync(pattern, { ignore: CONFIG.ignore });

    files.forEach((filePath) => {
      const lineCount = getFileLineCount(filePath);
      const fileSize = getFileSize(filePath);
      const percentage = (lineCount / limit) * 100;

      const result = {
        file: filePath,
        lines: lineCount,
        limit: limit,
        percentage: percentage,
        size: fileSize,
        status: 'passed',
      };

      if (percentage >= CONFIG.errorThreshold * 100) {
        result.status = 'error';
        results.errors++;
      } else if (percentage >= CONFIG.warningThreshold * 100) {
        result.status = 'warning';
        results.warnings++;
      } else {
        results.passed++;
      }

      results.files.push(result);
    });
  });

  return results;
}

function displayResults(results) {
  log('\n📊 File Size Analysis Results:', 'blue');
  log('='.repeat(50), 'blue');

  // Summary
  log(`\n📈 Summary:`, 'cyan');
  log(`  ✅ Passed: ${results.passed}`, 'green');
  log(`  ⚠️  Warnings: ${results.warnings}`, 'yellow');
  log(`  ❌ Errors: ${results.errors}`, 'red');

  // Detailed results
  if (results.files.length > 0) {
    log(`\n📋 Detailed Results:`, 'cyan');

    // Sort by status (errors first, then warnings, then passed)
    const sortedFiles = results.files.sort((a, b) => {
      const statusOrder = { error: 0, warning: 1, passed: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    sortedFiles.forEach((file) => {
      const statusIcon =
        file.status === 'error'
          ? '❌'
          : file.status === 'warning'
            ? '⚠️ '
            : '✅';
      const statusColor =
        file.status === 'error'
          ? 'red'
          : file.status === 'warning'
            ? 'yellow'
            : 'green';

      log(`  ${statusIcon} ${file.file}`, statusColor);
      log(
        `     Lines: ${file.lines}/${file.limit} (${file.percentage.toFixed(1)}%)`,
        'reset'
      );
      log(`     Size: ${formatFileSize(file.size)}`, 'reset');

      if (file.status === 'error') {
        log(
          `     💡 Consider refactoring this file - it exceeds the ${file.limit} line limit`,
          'yellow'
        );
      } else if (file.status === 'warning') {
        log(
          `     💡 This file is approaching the ${file.limit} line limit`,
          'yellow'
        );
      }
    });
  }

  // Recommendations
  if (results.errors > 0 || results.warnings > 0) {
    log(`\n💡 Recommendations:`, 'cyan');

    if (results.errors > 0) {
      log(
        `  • Refactor large files by extracting components, utilities, or services`,
        'yellow'
      );
      log(
        `  • Split complex functions into smaller, focused functions`,
        'yellow'
      );
      log(
        `  • Consider using composition over large monolithic components`,
        'yellow'
      );
    }

    if (results.warnings > 0) {
      log(
        `  • Monitor files approaching the limit for future refactoring`,
        'yellow'
      );
      log(
        `  • Consider extracting reusable logic into separate modules`,
        'yellow'
      );
    }

    log(`  • Use the following patterns to reduce file size:`, 'yellow');
    log(`    - Extract custom hooks for complex logic`, 'yellow');
    log(`    - Create utility functions for common operations`, 'yellow');
    log(
      `    - Split large components into smaller, focused components`,
      'yellow'
    );
    log(
      `    - Use TypeScript interfaces to separate type definitions`,
      'yellow'
    );
  }

  return results;
}

function generateReport(results) {
  const reportPath = path.join(process.cwd(), 'file-size-report.json');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      passed: results.passed,
      warnings: results.warnings,
      errors: results.errors,
      total: results.files.length,
    },
    files: results.files,
    config: CONFIG,
  };

  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`\n📄 Report saved to: ${reportPath}`, 'blue');
  } catch (error) {
    log(`\n❌ Failed to save report: ${error.message}`, 'red');
  }
}

function checkComplexity() {
  log('\n🧮 Checking code complexity...', 'cyan');

  const complexityResults = {
    highComplexity: [],
    mediumComplexity: [],
    lowComplexity: [],
  };

  // This is a simplified complexity check
  // In a real implementation, you might use tools like ESLint complexity rules
  // or dedicated complexity analysis tools

  log('  💡 Use ESLint complexity rules to monitor code complexity', 'yellow');
  log(
    '  💡 Consider using tools like SonarQube for advanced complexity analysis',
    'yellow'
  );

  return complexityResults;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case '--check':
    case '-c':
      const results = checkFileSizes();
      displayResults(results);
      generateReport(results);

      if (results.errors > 0) {
        log('\n❌ File size check failed!', 'red');
        process.exit(1);
      } else if (results.warnings > 0) {
        log('\n⚠️  File size check passed with warnings', 'yellow');
        process.exit(0);
      } else {
        log('\n✅ File size check passed!', 'green');
        process.exit(0);
      }
      break;

    case '--complexity':
      checkComplexity();
      break;

    case '--help':
    case '-h':
    default:
      log('\n🔍 File Size Monitoring Tool', 'cyan');
      log('============================', 'cyan');
      log('\nUsage:', 'blue');
      log('  node scripts/check-file-sizes.js [command]', 'blue');
      log('\nCommands:', 'blue');
      log('  --check, -c     Check file sizes and generate report', 'blue');
      log('  --complexity    Check code complexity (placeholder)', 'blue');
      log('  --help, -h      Show this help message', 'blue');
      log('\nConfiguration:', 'blue');
      log('  File size limits are defined in the script configuration', 'blue');
      log('  Current limits:', 'blue');
      Object.entries(CONFIG.limits).forEach(([pattern, limit]) => {
        log(`    ${pattern}: ${limit} lines`, 'blue');
      });
      break;
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkFileSizes,
  displayResults,
  generateReport,
  CONFIG,
};
