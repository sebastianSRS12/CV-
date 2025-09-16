#!/usr/bin/env node

/**
 * Dependency installation script for CV Builder Pro
 * Installs all required packages in the correct order
 * Handles potential installation issues and provides feedback
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
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

/**
 * Logs colored messages to console
 * @param {string} message - Message to log
 * @param {string} color - Color code to use
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Executes shell command with error handling
 * @param {string} command - Command to execute
 * @param {string} description - Description for logging
 * @returns {boolean} Success status
 */
function runCommand(command, description) {
  try {
    log(`\n📦 ${description}...`, colors.blue);
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed successfully`, colors.green);
    return true;
  } catch (error) {
    log(`❌ Failed to ${description.toLowerCase()}`, colors.red);
    log(`Error: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Checks if file exists
 * @param {string} filePath - Path to check
 * @returns {boolean} File exists
 */
function fileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

/**
 * Main installation process
 */
async function main() {
  log('🚀 CV Builder Pro - Dependency Installation', colors.bright + colors.cyan);
  log('=' .repeat(50), colors.cyan);

  // Check if package.json exists
  if (!fileExists('package.json')) {
    log('❌ package.json not found. Please run this script from the project root.', colors.red);
    process.exit(1);
  }

  // List of dependencies to install
  const dependencies = [
    {
      packages: ['clsx', 'tailwind-merge'],
      description: 'Install UI utility packages',
      type: 'production'
    },
    {
      packages: ['@next-auth/prisma-adapter'],
      description: 'Install NextAuth Prisma adapter',
      type: 'production'
    },
    {
      packages: ['@types/node', '@types/react', '@types/react-dom'],
      description: 'Install TypeScript type definitions',
      type: 'development'
    }
  ];

  let allSuccessful = true;

  // Install each dependency group
  for (const dep of dependencies) {
    const flag = dep.type === 'development' ? '--save-dev' : '';
    const command = `npm install ${dep.packages.join(' ')} ${flag}`.trim();
    
    const success = runCommand(command, dep.description);
    if (!success) {
      allSuccessful = false;
    }
  }

  // Generate Prisma client if schema exists
  if (fileExists('prisma/schema.prisma')) {
    log('\n🔧 Setting up Prisma...', colors.magenta);
    const prismaSuccess = runCommand('npx prisma generate', 'Generate Prisma client');
    if (!prismaSuccess) {
      allSuccessful = false;
    }
  }

  // Final status
  log('\n' + '=' .repeat(50), colors.cyan);
  if (allSuccessful) {
    log('🎉 All dependencies installed successfully!', colors.bright + colors.green);
    log('\nNext steps:', colors.bright);
    log('1. Copy env.template to .env and configure your environment variables', colors.yellow);
    log('2. Set up your PostgreSQL database', colors.yellow);
    log('3. Configure Google OAuth credentials', colors.yellow);
    log('4. Run: npm run dev', colors.yellow);
  } else {
    log('⚠️  Some installations failed. Please check the errors above.', colors.bright + colors.red);
    log('You may need to install failed packages manually.', colors.yellow);
  }

  log('\nFor detailed setup instructions, see SETUP.md', colors.blue);
}

// Run the installation
main().catch(error => {
  log(`💥 Installation script failed: ${error.message}`, colors.red);
  process.exit(1);
});
