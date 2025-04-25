// Script to add mock data to the database
// Run with: node scripts/add-mock-data.js

const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables from .env file

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';

async function addMockData() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Collections
    const clientsCollection = db.collection('clients');
    const invoicesCollection = db.collection('invoices');

    // 1. Check existing clients
    const existingClients = await clientsCollection.find({}).toArray();
    console.log(`Found ${existingClients.length} existing clients`);

    // 2. Add new clients if needed
    const mockClients = [
      {
        name: "Acme Corporation",
        email: "contact@acmecorp.com",
        phone: "555-123-4567",
        address: "123 Business Ave, Suite 100, New York, NY 10001",
        created_at: new Date(),
        client_id: "CLI-ACME1",
        last_activity: new Date()
      },
      {
        name: "Globex Industries",
        email: "info@globexindustries.com",
        phone: "555-987-6543",
        address: "456 Enterprise Blvd, Chicago, IL 60601",
        created_at: new Date(),
        client_id: "CLI-GLOB2",
        last_activity: new Date()
      },
      {
        name: "Sirius Cybernetics",
        email: "support@siriuscyber.com",
        phone: "555-321-7890",
        address: "789 Future Drive, San Francisco, CA 94105",
        created_at: new Date(),
        client_id: "CLI-SIRI3",
        last_activity: new Date()
      },
      {
        name: "Wayne Enterprises",
        email: "business@wayneent.com",
        phone: "555-228-6337",
        address: "1 Wayne Tower, Gotham City, NJ 07101",
        created_at: new Date(),
        client_id: "CLI-WAYN4",
        last_activity: new Date()
      },
      {
        name: "Stark Industries",
        email: "contracts@starkind.com",
        phone: "555-466-9273",
        address: "200 Park Avenue, New York, NY 10166",
        created_at: new Date(),
        client_id: "CLI-STAR5",
        last_activity: new Date()
      }
    ];

    // Add clients that don't exist yet (by name)
    const existingClientNames = new Set(existingClients.map(client => client.name));
    const clientsToAdd = mockClients.filter(client => !existingClientNames.has(client.name));
    
    let addedClients = [];
    if (clientsToAdd.length > 0) {
      const result = await clientsCollection.insertMany(clientsToAdd);
      console.log(`Added ${result.insertedCount} new clients`);
      
      // Get the newly added clients with their MongoDB _id
      const newlyAddedClients = await clientsCollection.find({
        name: { $in: clientsToAdd.map(client => client.name) }
      }).toArray();
      
      addedClients = newlyAddedClients;
    } else {
      console.log('No new clients needed to be added');
    }

    // 3. Get all clients (existing + newly added)
    const allClients = [...existingClients, ...addedClients];
    
    // 4. Generate invoices for all clients
    const mockInvoices = [];
    const statuses = ['paid', 'unpaid', 'overdue'];
    
    allClients.forEach(client => {
      // Create 1-3 invoices per client
      const numInvoices = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numInvoices; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomAmount = (Math.random() * 9900 + 100).toFixed(2); // Amount between $100 and $10,000
        
        // Due date: random date between 30 days ago and 30 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 30);
        
        mockInvoices.push({
          client_name: client.name,
          client_id: client._id.toString(), // Reference to the client by MongoDB _id
          amount: parseFloat(randomAmount),
          status: randomStatus,
          due_date: dueDate,
          notes: `Invoice for ${client.name}`,
          created_at: new Date()
        });
      }
    });

    // 5. Insert the invoices
    if (mockInvoices.length > 0) {
      const result = await invoicesCollection.insertMany(mockInvoices);
      console.log(`Added ${result.insertedCount} new invoices`);
    }

    console.log('Mock data added successfully!');
  } catch (error) {
    console.error('Error adding mock data:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

// Run the function
addMockData(); 