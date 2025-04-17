export default async function handler(req, res) {
  try {
    // Check if our backend is up
    let backendStatus;
    
    try {
      // Use a timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/health`, 
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
      
      const data = await response.json();
      backendStatus = data.message || 'connected';
    } catch (backendError) {
      console.error('Backend connection error:', backendError.message);
      throw new Error(`Backend connection failed: ${backendError.message}`);
    }

    return res.status(200).json({
      status: 'ok',
      backendStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error.message);
    return res.status(200).json({  // Always return 200 with error in body
      status: 'error',
      message: error.message || 'Backend is not reachable or returned invalid response',
      timestamp: new Date().toISOString()
    });
  }
} 