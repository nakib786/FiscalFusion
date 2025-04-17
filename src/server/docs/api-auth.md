# API Key Authentication

This document explains how to use API key authentication in FiscalFusion.

## Overview

FiscalFusion uses API keys to authenticate API requests. API keys provide a simple and secure way to authenticate requests to the API without requiring user credentials.

## Generating API Keys

API keys can be generated through the `/api/keys` endpoint. This endpoint requires a user to be authenticated through the regular authentication system.

```
POST /api/keys
Content-Type: application/json

{
  "userId": "user123",
  "name": "My API Key",
  "expiresIn": 30  // Optional: days until expiration, defaults to 30
}
```

## Using API Keys

When making requests to protected endpoints, you can provide your API key in one of three ways:

### 1. Authorization Header (Recommended)

```
GET /api/protected
Authorization: Bearer your-api-key-here
```

### 2. X-API-Key Header

```
GET /api/protected
X-API-Key: your-api-key-here
```

### 3. Query Parameter

```
GET /api/protected?api_key=your-api-key-here
```

## Protected Endpoints

The following endpoints require API key authentication:

- `GET /api/protected` - Basic protected endpoint that returns user information
- `GET /api/protected/user` - Returns detailed user data
- `POST /api/protected/data` - Accepts and processes data

## Managing API Keys

You can manage your API keys through the following endpoints:

- `GET /api/keys` - List all API keys for a user
- `DELETE /api/keys/:keyId` - Revoke an API key

## Security Considerations

- Keep your API keys secure and never expose them in client-side code
- Rotate your API keys regularly by generating new keys and revoking old ones
- Use the most restrictive permissions necessary for your use case
- Monitor API key usage for any suspicious activity

## Error Responses

When authentication fails, the API will respond with appropriate HTTP status codes:

- `401 Unauthorized` - Missing or invalid API key
- `403 Forbidden` - Valid API key but insufficient permissions
- `500 Internal Server Error` - Authentication system error

## Example API Key Usage

### JavaScript/Node.js

```javascript
const axios = require('axios');

const apiKey = 'your-api-key-here';
const baseUrl = 'https://api.fiscalfusion.com';

// Make an authenticated request
async function getProtectedData() {
  try {
    const response = await axios.get(`${baseUrl}/api/protected`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('API request failed:', error.response?.data || error.message);
    throw error;
  }
}
```

### cURL

```bash
curl -X GET "https://api.fiscalfusion.com/api/protected" \
  -H "Authorization: Bearer your-api-key-here"
```

### Python

```python
import requests

api_key = 'your-api-key-here'
base_url = 'https://api.fiscalfusion.com'

# Make an authenticated request
response = requests.get(
    f'{base_url}/api/protected',
    headers={'Authorization': f'Bearer {api_key}'}
)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f'Error: {response.status_code}')
    print(response.json())
``` 