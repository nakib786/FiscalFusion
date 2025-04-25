# FiscalFusion Scripts

This directory contains utility scripts for FiscalFusion.

## Client ID Update Script

The `update-client-ids.js` script adds client IDs and creation dates to all existing clients in the database.

### What it does

- Generates a unique readable client ID in the format `CLI-X1234-0001` for each client
- Adds a `created_at` date for clients missing this information
- Adds a `last_activity` date for tracking client activity

### Running the script

1. Make sure your MongoDB connection string is set in your environment variables or .env file
   ```
   MONGODB_URI=mongodb://localhost:27017/fiscalfusion
   ```

2. Run the script using npm:
   ```
   npm run update-client-ids
   ```

3. Or run it directly:
   ```
   node scripts/update-client-ids.js
   ```

### Client ID Format

The client IDs follow this pattern:
- Prefix: `CLI-`
- Client initial: First letter of the client's name
- Random characters: 4 random alphanumeric characters
- Index: Hyphen followed by a 4-digit client index (starting at 0001)

Example: `CLI-A4B2C-0001`

This format creates readable IDs that are easy to recognize and reference. 