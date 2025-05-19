// @ts-check
'use strict';

/** @type {import('workbox-build').GenerateSWOptions} */
const config = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,gif,ico,webp,woff,woff2,ttf,eot,json}'
  ],
  swDest: 'dist/sw.js',
  sourcemap: false,
  mode: 'production',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
  dontCacheBustURLsMatching: /\.\w{8}\./,
  runtimeCaching: [
    {
      urlPattern: ({url}) => {
        return url.origin === 'https://fonts.googleapis.com' ||
               url.origin === 'https://fonts.gstatic.com';
      },
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    },
    {
      urlPattern: /\/\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /\/api/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60 // 5 minutes
        },
        networkTimeoutSeconds: 10
      }
    }
  ]
};

// Export the configuration for Workbox
module.exports = config;
