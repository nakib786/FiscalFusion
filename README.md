# FiscalFusion

A scalable, robust, and future-proof full stack desktop application for accounting with a mobile companion app. The application is designed for the Canada, USA, and Europe markets.

## Tech Stack

- **Frontend**: React, Electron
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: OAuth, JWT, API Keys
- **API**: GraphQL, REST
- **Mobile**: React Native

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v18 or later)
- npm (v8 or later)
- PostgreSQL (v14 or later)
- Git
- Docker (optional, for containerization)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd fiscalfusion
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the variables with your configuration

4. Set up the database:
   - Create a PostgreSQL database named `fiscalfusion`
   - Run the database setup script: `npm run setup-db`
   - Or let the application automatically handle database initialization

## Database Configuration

The application requires a PostgreSQL database to function properly. Without a database connection, the application will fall back to using mock data.

### Setting up PostgreSQL

1. Install PostgreSQL on your system if you haven't already
2. Create a database for the application:
   ```
   createdb fiscalfusion
   ```
3. Update your `.env` file with the correct database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_NAME=fiscalfusion
   ```

### Initialize the Database

To set up the database tables and load sample data:

```
npm run setup-db
```

This script will:
- Connect to your PostgreSQL database
- Create all required tables
- Populate tables with sample data for testing

### Running with Database Support

To ensure your application properly connects to the database when starting:

```
npm run dev:full    # For development with Next.js
npm run start:full  # For production with Express
```

These commands will set up the database and then start the application.

## Development

### Running the server

```
npm run dev
```

This will start the Express server with nodemon for automatic reloading on file changes.

### Running the Electron app

```
npm run electron
```

This will start the Electron desktop application.

### Running tests

```
npm test
```

This will run all tests using Jest.

## Building for Production

To build the application for production:

```
npm run build
```

## Mobile Companion App

The mobile companion app is built with React Native. Follow these steps to set it up:

1. Navigate to the mobile directory:
   ```
   cd mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the app in development mode:
   ```
   npm start
   ```

## Features

- **Invoicing and Billing**: Automated invoicing and billing functionalities
- **Expense Tracking**: Real-time expense tracking and reporting
- **Financial Reporting**: Detailed financial reports and analytics
- **Bank Reconciliation**: Seamless bank reconciliation processes
- **API Authentication**: Secure API key authentication
- **Screenshot Functionality**: Capture and save screenshots of application pages for documentation and sharing

## Screenshot Functionality

FiscalFusion includes a built-in screenshot capability that allows users to:

- Capture individual page screenshots with a single click
- Batch capture screenshots of all major application pages
- Automatically name and save images to your device
- Use images for documentation, training, or support purposes

Access the screenshot tool from the sidebar navigation under "Screenshots" or use the screenshot button available on each page.

## API Authentication

FiscalFusion supports API key authentication for secure access to the API. This allows third-party applications and services to securely interact with the platform.

For details on how to use API key authentication, see the [API Authentication Documentation](src/server/docs/api-auth.md).

### Key Features:

- Multiple authentication methods (Authorization header, X-API-Key header, query parameter)
- Secure key generation and validation
- Optional and required authentication middleware
- Detailed error responses

## License

This project is licensed under the ISC License. 