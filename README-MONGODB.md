# MongoDB Integration for FiscalFusion

This project now uses MongoDB 8.0 as its database backend. The following instructions will help you set up and configure MongoDB for this application.

## Prerequisites

1. Install MongoDB 8.0 on your system:
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download MongoDB 8.0 for your operating system
   - Follow the installation instructions

## Configuration

1. Create a `.env` file in the root directory of the project with the following content:

```
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fiscalfusion

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

2. Adjust the `MONGODB_URI` value if your MongoDB instance is running on a different host, port, or if you wish to use a different database name.

## Setup Database

The project includes a script to set up the MongoDB database and import initial data:

```bash
npm run setup-mongodb
```

This will:
1. Create all necessary collections
2. Add appropriate indexes
3. Import sample data (clients, invoices, etc.)

## Running the Application

After setting up MongoDB, you can start the application with:

```bash
npm run start:full
```

This command will first run the MongoDB setup script and then start the application.

For development mode with hot reloading:

```bash
npm run dev:full
```

## Features

The MongoDB integration includes:

1. Proper document schemas with appropriate indexes
2. MongoDB aggregation for complex queries
3. Transaction support for multi-document operations
4. Proper error handling for database operations
5. Connection pooling for efficient database access

## Compatibility

This implementation is based on MongoDB 8.0, which includes several important improvements:

- Enhanced query performance
- Support for transactions
- Improved security features
- Vector search capabilities
- Batch processing for multi-document operations

## Troubleshooting

If you encounter issues with the MongoDB connection:

1. Ensure MongoDB is running:
   ```bash
   mongod --version
   ```

2. Check if you can connect to the MongoDB instance:
   ```bash
   mongosh
   ```

3. Verify your MongoDB URI in the `.env` file

4. If experiencing permission issues, ensure your MongoDB user has the appropriate privileges.

## CMS Integration

The admin routes and controllers are designed to work with a CMS. The API endpoints are:

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/activity` - Get recent activity
- `PATCH /api/admin/invoices/:id/status` - Update invoice status
- `GET /api/admin/entities/:collectionName` - Generic entity listing for collections 