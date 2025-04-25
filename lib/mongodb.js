import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';
// Add proper connection options for MongoDB Atlas
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

let client;
let clientPromise;

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 