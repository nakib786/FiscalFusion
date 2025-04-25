import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function TawkToChat() {
  const router = useRouter();
  
  // Check if current page is dashboard or related pages
  const isDashboardArea = router.pathname.includes('/dashboard') || 
                          router.pathname.includes('/clients') || 
                          router.pathname.includes('/invoices') || 
                          router.pathname.includes('/expenses') || 
                          router.pathname.includes('/reports') ||
                          router.pathname.includes('/cashflow') ||
                          router.pathname.includes('/performance') ||
                          router.pathname.includes('/planner') ||
                          router.pathname.includes('/projects') ||
                          router.pathname.includes('/transactions') ||
                          router.pathname.includes('/accounts') ||
                          router.pathname.includes('/budgeting');

  useEffect(() => {
    // Only load tawk.to if not in dashboard area
    if (!isDashboardArea) {
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = 'https://embed.tawk.to/67ffeda8d825181910e0cd9c/1ip12mtt0';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      
      document.body.appendChild(s1);
      
      return () => {
        // Clean up script when component unmounts
        if (document.body.contains(s1)) {
          document.body.removeChild(s1);
        }
        
        // Also remove any tawk.to elements that might be created
        const tawkElements = document.querySelectorAll('iframe[title*="chat"]');
        tawkElements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };
    }
  }, [router.pathname, isDashboardArea]);

  // This component doesn't render anything visible
  return null;
} 