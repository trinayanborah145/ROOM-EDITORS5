import { useEffect } from 'react';

const useServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available, inform the user
                    console.log('New content is available; please refresh.');
                    // You can show a notification to the user here
                  } else {
                    // Content is cached for offline use
                    console.log('Content is cached for offline use.');
                  }
                }
              };
            }
          };

          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update().catch(err => 
              console.log('Service worker update check failed: ', err)
            );
          }, 60 * 60 * 1000);
          
        } catch (error) {
          console.error('ServiceWorker registration failed: ', error);
        }
      };

      // Register service worker after the page has loaded
      if (document.readyState === 'complete') {
        registerServiceWorker();
      } else {
        window.addEventListener('load', registerServiceWorker);
      }

      // Handle controller changes (when a new service worker takes over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);
};

export default useServiceWorker;