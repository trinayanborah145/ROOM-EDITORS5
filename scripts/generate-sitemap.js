const fs = require('fs');
const path = require('path');

// List of all your routes
const routes = [
  '/',
  '/services',
  '/portfolio',
  '/about',
  '/testimonials',
  '/blog',
  '/contact'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(route => {
      return `
    <url>
      <loc>https://yourwebsite.com${route}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

fs.writeFileSync(
  path.join(__dirname, '../public/sitemap.xml'),
  sitemap
);

console.log('Sitemap generated at public/sitemap.xml');
