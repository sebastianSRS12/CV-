const fs = require('fs');
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

console.log('🚀 Setting up authentication for CV Builder\n');

// Function to update or add environment variable
function updateEnvVar(key, value) {
  const regex = new RegExp(`^${key}=.*`, 'm');
  const newLine = `${key}=${value}`;
  
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, newLine);
  } else {
    envContent += `\n${newLine}`;
  }
}

async function setup() {
  console.log('Please provide the following details for authentication setup.\n');

  // NEXTAUTH_SECRET
  const secret = 'your_secure_random_string_here';
  updateEnvVar('NEXTAUTH_SECRET', secret);
  console.log(`🔑 NEXTAUTH_SECRET set to: ${secret}`);

  // NEXTAUTH_URL
  const nextAuthUrl = 'http://localhost:3000';
  updateEnvVar('NEXTAUTH_URL', nextAuthUrl);
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
  console.log('7. Save and note your Client ID and Client Secret\n');

  const googleClientId = await askQuestion('Enter your Google Client ID: ');
  const googleClientSecret = await askQuestion('Enter your Google Client Secret: ');
  
  updateEnvVar('GOOGLE_CLIENT_ID', googleClientId);
  updateEnvVar('GOOGLE_CLIENT_SECRET', googleClientSecret);

  // GitHub OAuth
  console.log('\n⚫ GitHub OAuth Setup:');
  console.log('1. Go to https://github.com/settings/developers');
  console.log('2. Click "New OAuth App"');
  console.log('3. Fill in the following details:');
  console.log('   - Homepage URL: http://localhost:3000');
  console.log('   - Authorization callback URL: http://localhost:3000/api/auth/callback/github');
  console.log('4. Register application and note your Client ID and Client Secret\n');

  const githubClientId = await askQuestion('Enter your GitHub Client ID: ');
  const githubClientSecret = await askQuestion('Enter your GitHub Client Secret: ');
  
  updateEnvVar('GITHUB_ID', githubClientId);
  updateEnvVar('GITHUB_SECRET', githubClientSecret);

  // Save the .env file
  fs.writeFileSync(envPath, envContent.trim());
  
  console.log('\n✅ Authentication setup complete!');
  console.log('🔒 .env file has been updated with your credentials');
  console.log('🚀 Restart your development server to apply the changes\n');
  
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
