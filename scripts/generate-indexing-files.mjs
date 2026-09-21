import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportagesPath = path.join(projectRoot, 'src', 'app', 'content', 'reportages.json');
const publicPath = path.join(projectRoot, 'public');
const siteUrl = (process.env.EDS_SITE_URL || 'https://www.edsportshots.com').replace(/\/+$/, '');

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const reportages = JSON.parse(await readFile(reportagesPath, 'utf8'));
const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/galerie', changefreq: 'weekly', priority: '0.8' },
  { path: '/reportages', changefreq: 'weekly', priority: '0.8' },
  { path: '/prestations', changefreq: 'monthly', priority: '0.7' },
  ...reportages.map((reportage) => ({
    path: `/reportages/${reportage.slug}`,
    lastmod: reportage.date,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const sitemapEntries = pages.map((page) => {
  const lastmod = page.lastmod ? `\n    <lastmod>${escapeXml(page.lastmod)}</lastmod>` : '';
  return `  <url>\n    <loc>${escapeXml(`${siteUrl}${page.path}`)}</loc>${lastmod}\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

await writeFile(path.join(publicPath, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(publicPath, 'robots.txt'), robots, 'utf8');

console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}`);
