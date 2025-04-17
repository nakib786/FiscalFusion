// Next.js API route for reports - proxies to Express server
import { handleApiError, mockData } from './_helpers';

export default async function handler(req, res) {
  try {
    // Try to get data from backend with improved error handling
    let data;
    
    try {
      // Use a timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/reports${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`, 
        { 
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        }
      );
      
      clearTimeout(timeoutId);
      
      // First check if response is ok
      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }
      
      // Check if response is JSON before trying to parse
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend did not return valid JSON');
      }
      
      data = await response.json();
    } catch (backendError) {
      console.error('Backend connection error:', backendError.message);
      throw new Error(`Backend connection failed: ${backendError.message}`);
    }

    // Pass through the backend response
    return res.status(200).json(data);
  } catch (error) {
    // Use helper to handle error and return mock data
    const errorResponse = await handleApiError(error, mockData.reports, 'reports API');
    return res.status(200).json(errorResponse);
  }
} 