const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

// Check if .env exists
const envExists = fs.existsSync(envPath);
let envContent = envExists ? fs.readFileSync(envPath, 'utf8') : '';

console.log('🚀 Setting up environment variables for CV Builder\n');

// Function to update or add environment variable
function updateEnvVar(key, value, comment = '') {
  if (comment) {
    const commentLine = `# ${comment}`;
    if (!envContent.includes(commentLine)) {
      envContent += `\n${commentLine}`;
    }
  }
  
  const regex = new RegExp(`^${key}=.*`, 'm');
  const newLine = `${key}=${value}`;
  
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, newLine);
  } else {
    envContent += `\n${newLine}`;
  }
}

async function setup() {
  console.log('🔧 Setting up environment variables...\n');

  // NEXTAUTH_SECRET
  const secret = crypto.randomBytes(32).toString('hex');
  updateEnvVar('NEXTAUTH_SECRET', secret, 'NextAuth secret (auto-generated)');
  console.log(`🔑 Generated NEXTAUTH_SECRET`);

  // NEXTAUTH_URL
  const nextAuthUrl = 'http://localhost:3000';
  updateEnvVar('NEXTAUTH_URL', nextAuthUrl, 'Base URL for authentication callbacks');
  console.log(`🌐 NEXTAUTH_URL set to: ${nextAuthUrl}`);

  // Google OAuth
  console.log('\n🔵 Google OAuth Setup:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select an existing one');
  console.log('3. Navigate to "APIs & Services" > "Credentials"');
  console.log('4. Click "Create Credentials" > "OAuth client ID"');
  console.log('5. Select "Web application" as the application type');
  console.log('6. Add these authorized redirect URIs:');
  console.log('   - http://localhost:3000/api/auth/callback/google');
  console.log('   - https://YOUR_VERCEL_URL.vercel.app/api/auth/callback/google');
  console.log('7. Save and enter your credentials below\n');

  const googleClientId = await askQuestion('Enter your Google Client ID: ');
  const googleClientSecret = await askQuestion('Enter your Google Client Secret: ');
  
  updateEnvVar('GOOGLE_CLIENT_ID', googleClientId, 'Google OAuth Client ID');
  updateEnvVar('GOOGLE_CLIENT_SECRET', googleClientSecret, 'Google OAuth Client Secret');

  // GitHub OAuth
  console.log('\n⚫ GitHub OAuth Setup:');
  console.log('1. Go to https://github.com/settings/developers');
  console.log('2. Click "New OAuth App"');
  console.log('3. Fill in the following details:');
  console.log('   - Application name: CV Builder');
  console.log('   - Homepage URL: http://localhost:3000');
  console.log('   - Authorization callback URL: http://localhost:3000/api/auth/callback/github');
  console.log('4. Register application and generate a new client secret\n');

  const githubClientId = await askQuestion('Enter your GitHub Client ID: ');
  const githubClientSecret = await askQuestion('Enter your GitHub Client Secret: ');
  
  updateEnvVar('GITHUB_ID', githubClientId, 'GitHub OAuth Client ID');
  updateEnvVar('GITHUB_SECRET', githubClientSecret, 'GitHub OAuth Client Secret');

  // Save the .env file
  fs.writeFileSync(envPath, envContent.trim());
  
  console.log('\n✅ Environment setup complete!');
  console.log('🔒 .env file has been created/updated with your credentials');
  console.log('🚀 Start your development server with: npm run dev\n');
  
  rl.close();
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Run the setup
setup().catch(console.error);
