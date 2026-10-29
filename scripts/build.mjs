import { cp, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = fileURLToPath(new URL('../docs/', import.meta.url));
if (resolve(output) !== resolve(repository, 'docs')) throw new Error('Unexpected output directory');
const build = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build', '--webpack'], {
  stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
});
const code = await new Promise((resolve, reject) => { build.on('error', reject); build.on('exit', resolve); });
if (code !== 0) process.exit(Number(code) || 1);
// Recreate only this repository's generated output after a successful framework build.
await rm(output, { recursive: true, force: true });
await cp(new URL('../out/', import.meta.url), output, { recursive: true });
const site = JSON.parse(await readFile(new URL('../content/site.json', import.meta.url), 'utf8'));
// Avoid redirecting the review deployment to a domain whose DNS is not configured.
if (site.customDomain) await writeFile(resolve(output, 'CNAME'), site.customDomain + '\n');
else await rm(resolve(output, 'CNAME'), { force: true });
async function protect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) { await protect(path); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = await readFile(path, 'utf8');
    const hashes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
      .filter(([, attributes]) => !/\bsrc=/.test(attributes))
      .map(([, , script]) => `'sha256-${createHash('sha256').update(script).digest('base64')}'`);
    const policy = `default-src 'self'; script-src 'self' https://www.googletagmanager.com ${[...new Set(hashes)].join(' ')}; style-src 'self'; img-src 'self' https://www.googletagmanager.com https://*.google-analytics.com; font-src 'self'; connect-src https://www.googletagmanager.com https://*.google-analytics.com https://www.google.com; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'`;
    // Hash exact build-generated inline scripts; never enable unrestricted inline execution.
    html = html.replace(/(<meta charSet="utf-8"\s*\/?>|<meta charset="utf-8"\s*\/?>)/i, `$1<meta http-equiv="Content-Security-Policy" content="${policy}">`);
    if (!html.includes('Content-Security-Policy')) throw new Error('Missing CSP insertion point');
    await writeFile(path, html);
  }
}
await protect(output);
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Next.js static export prepared in docs/ with per-page script hashes. No publication performed.');
