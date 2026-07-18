import fs from 'fs';
import path from 'path';

// Core routes of Chandra Bhanu Gupta Law College
const routes = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: 'about', changefreq: 'monthly', priority: '0.8' },
  { path: 'founder', changefreq: 'monthly', priority: '0.7' },
  { path: 'manager', changefreq: 'monthly', priority: '0.7' },
  { path: 'management', changefreq: 'monthly', priority: '0.7' },
  { path: 'courses', changefreq: 'monthly', priority: '0.9' },
  { path: 'facilities', changefreq: 'monthly', priority: '0.7' },
  { path: 'gallery', changefreq: 'monthly', priority: '0.6' },
  { path: 'notices', changefreq: 'daily', priority: '0.8' },
  { path: 'faq', changefreq: 'monthly', priority: '0.5' },
  { path: 'contact', changefreq: 'monthly', priority: '0.8' },
  { path: 'admission-enquiry', changefreq: 'monthly', priority: '0.9' }
];

const BASE_URL = 'https://cbglawcollege.in';

export function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    const loc = route.path ? `${BASE_URL}/${route.path}` : `${BASE_URL}/`;
    xml += '  <url>\n';
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>\n';

  // Make sure target folders exist
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`Successfully generated dynamic sitemap.xml at: ${sitemapPath}`);
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('generate-sitemap.ts')) {
  generateSitemap();
}
