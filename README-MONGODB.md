# MongoDB Atlas Integration for FiscalFusion

This project now uses MongoDB Atlas as its database backend. The migration from the local MongoDB to MongoDB Atlas has been completed.

## Configuration

The `.env` file in the root directory of the project contains the MongoDB Atlas connection string:

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://nakib786:Canada%402025@cluster0.42fxaw4.mongodb.net/fiscalfusion
```

## MongoDB Atlas Information

- **Cluster Name**: `atlas-kpc2tu-shard-0`
- **Hosts**:
  - `ac-beuwz29-shard-00-00.42fxaw4.mongodb.net:27017`
  - `ac-beuwz29-shard-00-01.42fxaw4.mongodb.net:27017`
  - `ac-beuwz29-shard-00-02.42fxaw4.mongodb.net:27017`
- **MongoDB Version**: `8.0.8 Atlas`

## Running the Application

To start the application:

```bash
npm run start:full
```

For development mode with hot reloading:

```bash
npm run dev:full
```

## Features

The MongoDB Atlas integration includes:

1. Proper document schemas with appropriate indexes
2. MongoDB aggregation for complex queries  
3. Transaction support for multi-document operations
4. Proper error handling for database operations
5. Connection pooling for efficient database access
6. Replica set support for high availability
7. Automated backups and recovery

## Compatibility

This implementation is based on MongoDB 8.0 Atlas, which includes several important improvements:

- Enhanced query performance
- Support for transactions
- Improved security features
- Vector search capabilities
- Batch processing for multi-document operations
- Distributed architecture for high availability
- Automatic scaling

## Troubleshooting

If you encounter issues with the MongoDB Atlas connection:

1. Check if you can connect to the MongoDB Atlas instance using MongoDB Compass
2. Verify your MongoDB Atlas URI in the `.env` file
3. Ensure your IP address is whitelisted in MongoDB Atlas
4. Check if your user has the appropriate database access privileges

## CMS Integration

The admin routes and controllers are designed to work with a CMS. The API endpoints are:

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/activity` - Get recent activity
- `PATCH /api/admin/invoices/:id/status` - Update invoice status
- `GET /api/admin/entities/:collectionName` - Generic entity listing for collections 