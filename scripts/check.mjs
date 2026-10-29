import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'docs');
const site = JSON.parse(await readFile(resolve(root, 'content/site.json'), 'utf8'));
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(resolve(directory, entry.name)) : resolve(directory, entry.name)))).flat();
}
const all = await files(output);
const routes = ['/', '/work/', '/about/', '/journal/', '/privacy/', '/work/a-smaller-digital-footprint/', '/work/a-decision-that-travels/', '/work/a-release-with-a-way-back/', '/journal/privacy-is-a-design-choice/', '/journal/before-the-diagram/'];
const titles = new Set();
let links = 0, scripts = 0;
for (const route of routes) {
  const file = resolve(output, '.' + route, 'index.html');
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Unique title required: ${route}`); titles.add(title);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `One heading required: ${route}`);
  assert(html.includes('class="site-header"') && html.includes('aria-label="Colour theme"') && ['System', 'Light', 'Dark'].every(label => html.includes(`aria-label="${label} theme"`)), `Shared navigation and accessible theme icons required: ${route}`);
  assert(/name="description"/.test(html), `Description missing: ${route}`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert(canonical, `Canonical URL missing: ${route}`);
  const canonicalUrl = new URL(canonical);
  assert.equal(canonicalUrl.origin, site.url);
  if (site.review) assert(/name="robots" content="noindex, nofollow"/.test(html), 'Review pages must request no indexing');
  assert.equal(canonicalUrl.pathname, route);
  assert(/name="referrer" content="no-referrer"/.test(html), 'Suppress referrers');
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  assert(policy?.includes("connect-src https://www.googletagmanager.com https://*.google-analytics.com https://www.google.com;") && policy.includes("form-action 'none'") && policy.includes("frame-src 'none'"), 'Only scoped Analytics endpoints may be allowed');
  assert(policy.includes("script-src 'self' https://www.googletagmanager.com ") && !/doubleclick|googleadservices|googlesyndication/.test(policy), 'Only the approved Google tag origin, without Ads endpoints');
  assert(html.includes('Analytics choices') && !html.includes('No tracking. No cookies.'), `Accurate Analytics controls required: ${route}`);
  assert(!policy.includes("'unsafe-inline'") && !policy.includes("'unsafe-eval'"), 'Do not weaken script policy');
  for (const [, attributes, script] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attributes)) continue;
    assert(policy.includes(`'sha256-${createHash('sha256').update(script).digest('base64')}'`), `Inline script hash missing: ${route}`);
    scripts++;
  }
  const page = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert(!/<(?:form|iframe|embed|object)\b|\b(?:mailto|tel):|\bon\w+=/i.test(page), 'No forms, embeds or private contact schemes');
  assert(!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(page), 'Do not expose email addresses');
  assert(!/\b(?:\+?64|0)[\s()-]*2[\d\s()-]{7,12}\b/.test(page), 'Do not expose phone numbers');
  for (const match of page.matchAll(/<(script|img|link)\b[^>]*\b(?:src|href)="([^"]+)"/gi)) {
    if (/\brel="canonical"/.test(match[0])) continue;
    assert(!/^(?:https?:)?\/\//i.test(match[2]), 'No third-party subresources');
  }
  for (const [, target] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(target.replaceAll('&amp;', '&'), `https://local.test${route}`);
    if (url.hostname !== 'local.test') {
      assert(['www.linkedin.com', 'github.com', 'docs.github.com', 'rikki.kiwi', new URL(site.url).hostname, 'policies.google.com'].includes(url.hostname), 'Unexpected outbound link');
      continue;
    }
    const pathname = decodeURIComponent(url.pathname);
    const targetFile = resolve(output, '.' + pathname, ...(pathname.endsWith('/') ? ['index.html'] : []));
    assert(all.includes(targetFile), `Missing target: ${target} from ${route}`);
    if (url.hash) assert((await readFile(targetFile, 'utf8')).includes(`id="${url.hash.slice(1)}"`), 'Missing fragment');
    links++;
  }
}
for (const directory of ['app', 'components', 'content', 'lib']) {
  for (const file of await files(resolve(root, directory))) {
    if (!/\.(tsx?|json)$/.test(file)) continue;
    const source = await readFile(file, 'utf8');
    assert(!/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|indexedDB|WebSocket|serviceWorker/.test(source), 'No unapproved network or storage APIs');
    if (relative(root, file).replaceAll('\\', '/') !== 'lib/analytics.ts') assert(!/sessionStorage|document\.cookie/.test(source), 'Consent storage and cookie cleanup must stay in the tested Analytics controller');
  }
}
assert(!all.some(file => /\.(pdf|docx?|map)$/i.test(file)), 'No private documents or source maps in deployment output');
for (const asset of ['rikki-portrait.webp', 'rikki-standing.webp', 'rikki-standing-cutout.webp']) {
  const portrait = await readFile(resolve(output, asset));
  assert.equal(portrait.toString('ascii', 8, 12), 'WEBP', 'Portrait must be a local WebP');
  let hasAlpha = false;
  for (let offset = 12; offset + 8 <= portrait.length;) {
    const chunk = portrait.toString('ascii', offset, offset + 4);
    assert(!['EXIF', 'XMP ', 'ICCP', 'IPTC'].includes(chunk), 'Portrait metadata must be stripped');
    if (chunk === 'VP8X') hasAlpha ||= Boolean(portrait[offset + 8] & 0x10);
    if (chunk === 'VP8L') hasAlpha ||= Boolean(portrait.readUInt32LE(offset + 9) & 0x10000000);
    const size = portrait.readUInt32LE(offset + 4);
    offset += 8 + size + (size % 2);
  }
  if (asset === 'rikki-standing-cutout.webp') assert(hasAlpha, 'Standing cutout must retain transparency');
}
const aboutHtml = await readFile(resolve(output, 'about/index.html'), 'utf8');
assert.equal(aboutHtml.match(/<img[^>]*src="([^"]+)"/)?.[1], '/rikki-portrait.webp', 'Original portrait must lead About');
assert(/<details class="about-playful">/.test(aboutHtml), 'Playful detail must be optional and closed by default');
assert(aboutHtml.includes('src="/rikki-standing-cutout.webp"') && aboutHtml.includes('loading="lazy"'), 'Optional standee must remain local and lazy-loaded');
assert(all.includes(resolve(output, '404.html')), '404 page required');
assert(all.includes(resolve(output, '.nojekyll')), 'Static Pages marker required');
if (site.customDomain) assert.equal((await readFile(resolve(output, 'CNAME'), 'utf8')).trim(), site.customDomain, 'Custom domain must survive export');
else assert(!all.includes(resolve(output, 'CNAME')), 'Review deployment must not redirect to an unconfigured domain');
assert(!all.includes(resolve(output, 'privacy.html')), 'Remove stale prototype pages');
console.log(`Passed: ${routes.length} routes, ${links} links/assets, ${scripts} exact inline-script hashes, metadata and privacy restrictions.`);
