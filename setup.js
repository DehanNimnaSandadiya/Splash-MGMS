#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting MGMS setup...\n');

try {
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Root dependencies installed\n');

  console.log('📦 Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: join(__dirname, 'backend') });
  console.log('✅ Backend dependencies installed\n');

  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: join(__dirname, 'frontend') });
  console.log('✅ Frontend dependencies installed\n');

  console.log('📝 Setting up environment files...');
  
  const backendEnvExample = join(__dirname, 'backend', '.env.example');
  const backendEnv = join(__dirname, 'backend', '.env');
  if (existsSync(backendEnvExample) && !existsSync(backendEnv)) {
    copyFileSync(backendEnvExample, backendEnv);
    console.log('✅ Created backend/.env from .env.example');
    console.log('⚠️  Please update backend/.env with your actual values\n');
  } else if (existsSync(backendEnv)) {
    console.log('ℹ️  backend/.env already exists, skipping...\n');
  }

  console.log('✨ Setup complete!\n');
  console.log('📋 Next steps:');
  console.log('   1. Update backend/.env with your MongoDB URI, JWT secrets, etc.');
  console.log('   2. Update .env (if needed) with your configuration');
  console.log('   3. Start MongoDB (if using local instance)');
  console.log('   4. Run "npm run dev" to start the application\n');
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}

