import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch images from Unsplash
 * @param {string} query - Search query for Unsplash
 * @param {string} fallbackId - Fallback image ID if the API fails
 * @returns {string|null} - URL of the image
 */
const useUnsplashImage = (query, fallbackId = null) => {
  const [imageUrl, setImageUrl] = useState(null);
  
  useEffect(() => {
    const fetchImage = async () => {
      try {
        // First check if there's a cached image for this query
        const cachedImage = localStorage.getItem(`unsplash_${query}`);
        const cachedTimestamp = localStorage.getItem(`unsplash_${query}_timestamp`);
        
        // Use cache if it exists and is less than 12 hours old
        if (cachedImage && cachedTimestamp) {
          const now = new Date().getTime();
          const timestamp = parseInt(cachedTimestamp, 10);
          
          // Cache valid for 12 hours (43200000 ms)
          if (now - timestamp < 43200000) {
            setImageUrl(cachedImage);
            return;
          }
        }
        
        // Make API request to Unsplash
        const response = await fetch('http://localhost:5000/api/unsplash/random', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        
        if (response.ok) {
          const data = await response.json();
          const url = data.urls.regular;
          
          // Cache the result
          localStorage.setItem(`unsplash_${query}`, url);
          localStorage.setItem(`unsplash_${query}_timestamp`, new Date().getTime().toString());
          
          setImageUrl(url);
        } else if (fallbackId) {
          // Use fallback image if provided
          setImageUrl(`https://source.unsplash.com/${fallbackId}`);
        }
      } catch (error) {
        console.error('Error fetching Unsplash image:', error);
        
        // Use fallback if provided
        if (fallbackId) {
          setImageUrl(`https://source.unsplash.com/${fallbackId}`);
        }
      }
    };
    
    fetchImage();
  }, [query, fallbackId]);
  
  return imageUrl;
};

export default useUnsplashImage; 