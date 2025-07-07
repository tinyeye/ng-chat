#!/usr/bin/env node

/**
 * Upgrade Verification Script
 * 
 * This script verifies that the Angular and Node.js upgrade was successful
 * by checking versions and configuration files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying Angular & Node.js Upgrade...\n');

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol}${colors.reset} ${message}`);
}

function success(message) {
  log(colors.green, '✅', message);
}

function error(message) {
  log(colors.red, '❌', message);
}

function warning(message) {
  log(colors.yellow, '⚠️ ', message);
}

function info(message) {
  log(colors.blue, 'ℹ️ ', message);
}

let hasErrors = false;

// Check Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    success(`Node.js version: ${nodeVersion} (✓ >= 18.13.0)`);
  } else {
    error(`Node.js version: ${nodeVersion} (✗ requires >= 18.13.0)`);
    hasErrors = true;
  }
} catch (err) {
  error('Could not determine Node.js version');
  hasErrors = true;
}

// Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check Angular version
  const angularVersion = packageJson.dependencies['@angular/core'];
  if (angularVersion && angularVersion.includes('18')) {
    success(`Angular version: ${angularVersion}`);
  } else {
    error(`Angular version not updated: ${angularVersion}`);
    hasErrors = true;
  }
  
  // Check TypeScript version
  const tsVersion = packageJson.devDependencies['typescript'];
  if (tsVersion && tsVersion.includes('5.4')) {
    success(`TypeScript version: ${tsVersion}`);
  } else {
    warning(`TypeScript version: ${tsVersion} (consider updating to 5.4+)`);
  }
  
  // Check for ESLint
  if (packageJson.devDependencies['eslint']) {
    success('ESLint configured');
  } else {
    warning('ESLint not found in devDependencies');
  }
  
  // Check for Cypress
  if (packageJson.devDependencies['cypress']) {
    success('Cypress configured');
  } else {
    warning('Cypress not found in devDependencies');
  }
  
  // Check engine requirements
  if (packageJson.engines && packageJson.engines.node) {
    success(`Node.js engine requirement: ${packageJson.engines.node}`);
  } else {
    warning('No Node.js engine requirement specified');
  }
  
} catch (err) {
  error('Could not read or parse package.json');
  hasErrors = true;
}

// Check for configuration files
const configFiles = [
  { file: 'tsconfig.json', name: 'TypeScript config' },
  { file: 'angular.json', name: 'Angular CLI config' },
  { file: 'eslint.config.js', name: 'ESLint config' },
  { file: 'cypress.config.ts', name: 'Cypress config' },
  { file: 'karma.conf.js', name: 'Karma config' }
];

configFiles.forEach(({ file, name }) => {
  if (fs.existsSync(file)) {
    success(`${name} exists`);
  } else {
    warning(`${name} not found: ${file}`);
  }
});

// Check for deprecated files
const deprecatedFiles = [
  { file: 'tslint.json', name: 'TSLint config (should be removed)' },
  { file: 'protractor.conf.js', name: 'Protractor config (should be removed)' },
  { file: 'e2e/protractor.conf.js', name: 'E2E Protractor config (should be removed)' }
];

deprecatedFiles.forEach(({ file, name }) => {
  if (fs.existsSync(file)) {
    warning(`${name} still exists - consider removing: ${file}`);
  } else {
    success(`${name} properly removed`);
  }
});

// Check Angular CLI availability
try {
  const ngVersion = execSync('ng version --skip-confirmation', { encoding: 'utf8', stdio: 'pipe' });
  if (ngVersion.includes('Angular CLI') && ngVersion.includes('18.')) {
    success('Angular CLI 18 is available');
  } else {
    warning('Angular CLI version could not be verified or is not v18');
  }
} catch (err) {
  warning('Angular CLI not available globally (run: npm install -g @angular/cli@18)');
}

console.log('\n' + '='.repeat(50));

if (!hasErrors) {
  success('✨ Upgrade verification completed successfully!');
  info('Next steps:');
  console.log('   1. Run: npm install');
  console.log('   2. Run: ng build');
  console.log('   3. Run: ng test --no-watch');
  console.log('   4. Run: ng lint');
  console.log('   5. Check UPGRADE_COMPLETED.md for full verification checklist');
} else {
  error('❌ Some issues were found during verification');
  info('Please review the errors above and check:');
  console.log('   - Node.js version (should be 18.13.0+)');
  console.log('   - Package.json dependencies');
  console.log('   - MIGRATION_GUIDE.md for troubleshooting');
}

console.log('\n📚 Documentation:');
console.log('   - UPGRADE_PLAN.md - Detailed upgrade information');
console.log('   - MIGRATION_GUIDE.md - User migration guide');
console.log('   - UPGRADE_COMPLETED.md - What was changed');
console.log('   - README.md - Updated setup instructions\n');

process.exit(hasErrors ? 1 : 0);