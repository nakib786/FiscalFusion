const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Number of requests made in the current hour
let requestCount = 0;
// Time of last reset
let lastReset = Date.now();

// Middleware to check rate limit (50 requests per hour)
const checkRateLimit = (req, res, next) => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  // Reset counter if more than an hour has passed
  if (now - lastReset > oneHour) {
    requestCount = 0;
    lastReset = now;
  }
  
  // Check if rate limit exceeded
  if (requestCount >= 50) {
    return res.status(429).json({ 
      message: 'Rate limit exceeded. Unsplash API allows only 50 requests per hour.',
      error: 'RATE_LIMIT_EXCEEDED'
    });
  }
  
  // Continue
  next();
};

// Route to get a random image from Unsplash
router.post('/random', checkRateLimit, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    // Increment request counter
    requestCount++;
    
    // Get fallback URLs directly from source.unsplash.com if API key not set
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      const width = req.body.width || 1600;
      const height = req.body.height || 900;
      
      return res.json({
        urls: {
          raw: `https://source.unsplash.com/random/${width}x${height}?${query}`,
          full: `https://source.unsplash.com/random/${width}x${height}?${query}`,
          regular: `https://source.unsplash.com/random/${width}x${height}?${query}`,
          small: `https://source.unsplash.com/random/800x600?${query}`,
          thumb: `https://source.unsplash.com/random/400x300?${query}`
        },
        user: {
          name: 'Unsplash User',
          links: {
            html: 'https://unsplash.com'
          }
        }
      });
    }
    
    // Make request to Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format response
    res.json({
      id: data.id,
      description: data.description,
      alt_description: data.alt_description,
      urls: data.urls,
      user: {
        name: data.user.name,
        links: {
          html: data.user.links.html
        }
      }
    });
  } catch (error) {
    console.error('Unsplash API error:', error);
    
    // Provide fallback URL
    const width = req.body.width || 1600;
    const height = req.body.height || 900;
    const { query } = req.body;
    
    res.json({
      urls: {
        raw: `https://source.unsplash.com/random/${width}x${height}?${query}`,
        full: `https://source.unsplash.com/random/${width}x${height}?${query}`,
        regular: `https://source.unsplash.com/random/${width}x${height}?${query}`,
        small: `https://source.unsplash.com/random/800x600?${query}`,
        thumb: `https://source.unsplash.com/random/400x300?${query}`
      },
      user: {
        name: 'Unsplash User',
        links: {
          html: 'https://unsplash.com'
        }
      }
    });
  }
});

// Route to search images from Unsplash
router.post('/search', checkRateLimit, async (req, res) => {
  try {
    const { query, page = 1, per_page = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    // Increment request counter
    requestCount++;
    
    // Get fallback URLs directly from source.unsplash.com if API key not set
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return res.json({
        results: Array(per_page).fill().map((_, i) => ({
          id: `fallback-${i}`,
          urls: {
            raw: `https://source.unsplash.com/random?${query}`,
            full: `https://source.unsplash.com/random?${query}`,
            regular: `https://source.unsplash.com/random?${query}`,
            small: `https://source.unsplash.com/random/800x600?${query}`,
            thumb: `https://source.unsplash.com/random/400x300?${query}`
          },
          user: {
            name: 'Unsplash User',
            links: {
              html: 'https://unsplash.com'
            }
          }
        })),
        total: per_page,
        total_pages: 1
      });
    }
    
    // Make request to Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format response
    res.json({
      results: data.results.map(photo => ({
        id: photo.id,
        description: photo.description,
        alt_description: photo.alt_description,
        urls: photo.urls,
        user: {
          name: photo.user.name,
          links: {
            html: photo.user.links.html
          }
        }
      })),
      total: data.total,
      total_pages: data.total_pages
    });
  } catch (error) {
    console.error('Unsplash API error:', error);
    
    // Provide fallback
    const { query, per_page = 10 } = req.body;
    
    res.json({
      results: Array(per_page).fill().map((_, i) => ({
        id: `fallback-${i}`,
        urls: {
          raw: `https://source.unsplash.com/random?${query}`,
          full: `https://source.unsplash.com/random?${query}`,
          regular: `https://source.unsplash.com/random?${query}`,
          small: `https://source.unsplash.com/random/800x600?${query}`,
          thumb: `https://source.unsplash.com/random/400x300?${query}`
        },
        user: {
          name: 'Unsplash User',
          links: {
            html: 'https://unsplash.com'
          }
        }
      })),
      total: per_page,
      total_pages: 1
    });
  }
});

module.exports = router; 