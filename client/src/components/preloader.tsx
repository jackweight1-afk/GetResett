import { useEffect } from 'react';

// Preload critical resources for faster navigation
export function usePreloader() {
  useEffect(() => {
    const preloadCriticalRoutes = () => {
      // Preload critical route bundles
      const routes = ['/dashboard', '/checkout', '/subscribe'];
      
      routes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    const preloadCriticalAPIs = () => {
      // Warm up critical API endpoints
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Prefetch session types when browser is idle
          fetch('/api/session-types', { credentials: 'include' }).catch(() => {});
        });
      }
    };

    // Run preloading after initial load
    const timer = setTimeout(() => {
      preloadCriticalRoutes();
      preloadCriticalAPIs();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
}

// Optimize critical resource hints in document head
export function ResourceHints() {
  useEffect(() => {
    // Add DNS prefetch for external domains
    const dnsPrefetchDomains = [
      'https://ipapi.co',
      'https://api.exchangerate-api.com',
      'https://js.stripe.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);

  return null;
}