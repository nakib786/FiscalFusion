# MongoDB Atlas Migration Guide

This guide provides instructions for migrating your FiscalFusion data from the current MongoDB database to the new MongoDB Atlas cluster.

## Migration Steps

### 1. Verify Connection to the New Atlas Cluster

First, test the connection to your new MongoDB Atlas cluster:

```bash
node verify-atlas-connection.js
```

This will check if the connection string is correct and if you have the necessary permissions to access the cluster.

### 2. Migrate Data to MongoDB Atlas

Run the migration script to transfer all collections and data from your current MongoDB database to the Atlas cluster:

```bash
node migrate-to-atlas.js
```

This script will:
- Connect to both your current database and the Atlas cluster
- Copy all collections with their indexes
- Transfer all documents
- Preserve data relationships

### 3. Update Application Configuration

Update your application's MongoDB connection string to use the new Atlas cluster:

```bash
node update-mongodb-config.js
```

This will update your `.env` file with the new MongoDB Atlas connection string.

### 4. Verify the Migration

After migration, you can verify that all data has been properly migrated:

```bash
node verify-atlas-connection.js
```

Check that all collections and documents are present in the new database.

### 5. Clean Up Local Database

After verifying that the migration was successful, you can clean up the local MongoDB database:

```bash
node cleanup-local-db.js
```

This script will drop the local MongoDB database, freeing up disk space.

## MongoDB Atlas Connection Information

- **Connection String**: `mongodb+srv://nakib786:Canada%402025@cluster0.42fxaw4.mongodb.net/fiscalfusion`
- **Cluster Name**: `atlas-kpc2tu-shard-0`
- **Hosts**:
  - `ac-beuwz29-shard-00-00.42fxaw4.mongodb.net:27017`
  - `ac-beuwz29-shard-00-01.42fxaw4.mongodb.net:27017`
  - `ac-beuwz29-shard-00-02.42fxaw4.mongodb.net:27017`
- **MongoDB Version**: `8.0.8 Atlas`

## Migration Status

✅ **Migration Complete** - All data has been migrated to MongoDB Atlas.
✅ **Application Updated** - All components are configured to use MongoDB Atlas.
✅ **Local Database Cleaned** - The local MongoDB database has been dropped.

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify your network can access MongoDB Atlas (port 27017 should be open)
2. Check that your IP address is in the Atlas IP whitelist
3. Ensure your username and password are correct
4. Confirm the database name in the connection string

### Missing Data

If some data appears to be missing after migration:

1. Check collection names and ensure they match between source and target
2. Verify that your user has read permissions on the source database
3. Ensure your user has write permissions on the target Atlas database

### Timeout Errors

If you encounter timeout errors during migration:

1. Check your network stability
2. For large datasets, consider running the migration on a server close to your Atlas cluster
3. Break the migration into smaller batches if necessary

## Rollback Plan

If you need to revert to your previous MongoDB setup:

1. Restore the local MongoDB database from backup if available
2. Update your `.env` file with the previous MongoDB connection string: `mongodb://localhost:27017/fiscalfusion`
3. Restart your application to use the old database

## Need Help?

If you encounter any issues during the migration process, please contact the development team for assistance. 