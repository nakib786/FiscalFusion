// Next.js API route for clients - proxies to Express server
import { handleApiError, mockData } from './_helpers';

export default async function handler(req, res) {
  try {
    // Get the base URL from environment variables or use a default
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';
    
    // Forward the request to the Express server
    const response = await fetch(`${apiBaseUrl}/api/clients`);
    
    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    // Get the data
    const data = await response.json();
    
    // Return the data with success wrapper
    return res.status(200).json(data);
  } catch (error) {
    // Use helper to handle error and return mock data
    const errorResponse = await handleApiError(error, mockData.clients, 'clients API');
    return res.status(200).json(errorResponse);
  }
} 