/**
 * Verification script to check that the dashboard and cashflow API endpoints
 * are properly connected to the MongoDB database
 */
const { MongoClient } = require('mongodb');
const http = require('http');
const https = require('https');

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';

async function testDatabaseConnection() {
  console.log('Testing MongoDB connection...');
  const client = new MongoClient(mongoURI);
  
  try {
    await client.connect();
    console.log('✅ MongoDB connection successful');
    
    // Check for relevant collections
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('\nChecking required collections:');
    const requiredCollections = ['clients', 'invoices', 'expenses', 'transactions'];
    
    for (const collection of requiredCollections) {
      if (collectionNames.includes(collection)) {
        const count = await db.collection(collection).countDocuments();
        console.log(`✅ Collection "${collection}" exists with ${count} documents`);
      } else {
        console.log(`❌ Collection "${collection}" is missing`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  } finally {
    await client.close();
  }
}

function testAPIEndpoint(endpoint) {
  return new Promise((resolve) => {
    console.log(`Testing API endpoint: ${endpoint}`);
    
    // Determine whether to use http or https
    const requester = endpoint.startsWith('https') ? https : http;
    
    // Set timeout to 5 seconds
    const request = requester.get(endpoint, (response) => {
      const { statusCode } = response;
      
      if (statusCode !== 200) {
        console.log(`❌ API endpoint ${endpoint} returned status code ${statusCode}`);
        resolve(false);
        return;
      }
      
      let rawData = '';
      response.on('data', (chunk) => { rawData += chunk; });
      response.on('end', () => {
        try {
          const data = JSON.parse(rawData);
          if (data.success === true && data.source === 'database') {
            console.log(`✅ API endpoint ${endpoint} is connected to the database`);
            resolve(true);
          } else {
            console.log(`❌ API endpoint ${endpoint} is not using database data. Source: ${data.source || 'unknown'}`);
            resolve(false);
          }
        } catch (error) {
          console.log(`❌ API endpoint ${endpoint} returned invalid JSON:`, error.message);
          resolve(false);
        }
      });
    });
    
    request.on('error', (error) => {
      console.log(`❌ API endpoint ${endpoint} request failed:`, error.message);
      resolve(false);
    });
    
    request.setTimeout(5000, () => {
      console.log(`❌ API endpoint ${endpoint} request timed out`);
      request.abort();
      resolve(false);
    });
  });
}

async function main() {
  console.log('🔍 Starting verification of dashboard and cashflow connections\n');
  
  // Test database connection
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.log('\n❌ Database connection failed. Please check your MongoDB configuration.');
    process.exit(1);
  }
  
  console.log('\nTesting API endpoints:');
  
  // Test API endpoints
  const baseUrl = 'http://localhost:3000/api';
  const endpoints = [
    `${baseUrl}/dashboard`,
    `${baseUrl}/cashflow`,
    `${baseUrl}/transactions`
  ];
  
  let allSuccessful = true;
  
  for (const endpoint of endpoints) {
    const success = await testAPIEndpoint(endpoint);
    if (!success) {
      allSuccessful = false;
    }
  }
  
  console.log('\n');
  if (allSuccessful) {
    console.log('✅ All connections are working properly!');
    console.log('The dashboard and cashflow pages should now display real data from the database.');
  } else {
    console.log('❌ Some connections are not working properly.');
    console.log('Please check the issues above and fix them before proceeding.');
  }
}

// Run the verification
main().catch(error => {
  console.error('Verification failed with error:', error);
  process.exit(1);
}); 