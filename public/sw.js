const CACHE_NAME = 'oktt-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  // Add other critical assets
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    
    try {
      const response = await fetch(request);
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      
      const responseToCache = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, responseToCache);
      });
      
      return response;
    } catch (error) {
      return new Response('You are offline and no cache is available.', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
  
  // Network first, then cache
  networkFirst: async (request) => {
    try {
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) return cachedResponse;
      throw error;
    }
  },
  
  // Cache only
  cacheOnly: async (request) => {
    return await caches.match(request);
  },
  
  // Network only
  networkOnly: async (request) => {
    return await fetch(request);
  }
};

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests and chrome-extension URLs
  if (event.request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle API requests with network first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(CACHE_STRATEGIES.networkFirst(event.request));
    return;
  }
  
  // Handle static assets with cache first strategy
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    event.respondWith(CACHE_STRATEGIES.cacheFirst(event.request));
    return;
  }
  
  // Default: try network first, fall back to cache
  event.respondWith(
    CACHE_STRATEGIES.networkFirst(event.request)
      .catch(() => CACHE_STRATEGIES.cacheOnly(event.request))
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-failed-requests') {
    event.waitUntil(handleFailedRequests());
  }
});

async function handleFailedRequests() {
  // Implement your background sync logic here
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'New Update', {
      body: data.body || 'New content is available!',
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: {
        url: data.url || '/',
      },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
