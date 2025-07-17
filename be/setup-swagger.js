const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');



// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found! Please run this script from the backend directory.');
  process.exit(1);
}

// Install dependencies
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Test Swagger configuration
try {
  const testResult = execSync('node test-swagger.js', { encoding: 'utf8' });
} catch (error) {
  console.error('❌ Swagger test failed:', error.message);
}

 