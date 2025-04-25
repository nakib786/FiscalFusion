/**
 * Update MongoDB Configuration
 * This script creates or updates the .env file to use the new MongoDB Atlas connection string
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Path to .env file
const envPath = path.join(__dirname, '.env');

// New MongoDB Atlas connection string
const newMongoURI = 'mongodb+srv://nakib786:Canada%402025@cluster0.42fxaw4.mongodb.net/fiscalfusion';

async function updateConfig() {
  console.log('Updating MongoDB configuration...');
  
  let envVars = {};
  
  // Check if .env file exists
  if (fs.existsSync(envPath)) {
    console.log('Found existing .env file');
    
    // Parse existing .env file
    const existingEnv = fs.readFileSync(envPath, 'utf8');
    envVars = dotenv.parse(existingEnv);
    
    // Update MongoDB URI
    envVars.MONGODB_URI = newMongoURI;
  } else {
    console.log('Creating new .env file');
    
    // Create new .env with default values and the new MongoDB URI
    envVars = {
      PORT: '8080',
      NODE_ENV: 'development',
      MONGODB_URI: newMongoURI,
      JWT_SECRET: 'your_jwt_secret_key_here'
    };
  }
  
  // Convert env vars object to string format
  const envString = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  // Write to .env file
  fs.writeFileSync(envPath, envString);
  
  console.log('MongoDB configuration updated successfully');
  console.log(`MONGODB_URI is now set to: ${newMongoURI}`);
}

// Run the function
updateConfig().catch(console.error); 