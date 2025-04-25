import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { query, userId, username } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Create a new search history entry
    const searchHistoryEntry = {
      query,
      userId: userId || 'anonymous',
      username: username || 'Guest User',
      timestamp: new Date(),
      userAgent: req.headers['user-agent'] || 'Unknown',
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown'
    };
    
    // Insert the search history into MongoDB
    const result = await db.collection('searchHistory').insertOne(searchHistoryEntry);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Search history recorded successfully',
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error recording search history:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to record search history',
      error: error.message 
    });
  }
} 