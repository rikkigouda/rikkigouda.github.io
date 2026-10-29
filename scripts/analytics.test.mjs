import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../lib/analytics.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { analyticsAvailability, createAnalyticsController, consentKey } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

function mock({ hostname = 'rikki.kiwi', protocol = 'https:', pathname = '/about/', saved = null, privacy = false, dnt = false, storageBlocked = false } = {}) {
  const scripts = [], writes = [], stored = new Map(saved ? [[consentKey, saved]] : []);
  let cookie = 'rikki_ga=123; rikki_ga_ABC=456; unrelated=keep';
  const browser = {
    location: { hostname, protocol, pathname, href: `https://${hostname}${pathname}?email=private#secret` },
    navigator: { globalPrivacyControl: privacy, doNotTrack: dnt ? '1' : '0' },
    sessionStorage: {
      getItem: key => { if (storageBlocked) throw Error(); return stored.get(key) ?? null; },
      setItem: (key, value) => { if (storageBlocked) throw Error(); stored.set(key, value); },
    },
    document: {
      title: 'Untrusted title should never be sent',
      referrer: 'https://example.com/private?token=secret',
      get cookie() { return cookie; }, set cookie(value) { writes.push(value); },
      getElementById: id => scripts.find(script => script.id === id),
      createElement: () => ({}), head: { appendChild: script => scripts.push(script) },
    },
  };
  return { browser, scripts, writes, stored };
}
const id = 'G-TEST123';

test('no tag or queue before consent, and denial stays untracked', () => {
  const m = mock(); const c = createAnalyticsController(m.browser, id);
  assert.equal(c.restore(), null); assert.equal(m.scripts.length, 0); assert.equal(m.browser.dataLayer, undefined);
  c.choose('denied'); assert.equal(m.scripts.length, 0); assert.equal(m.browser[`ga-disable-${id}`], true);
  assert.equal(m.stored.get(consentKey), 'denied');
  assert(m.writes.every(value => value.startsWith('rikki_ga')));
});
test('consent loads one tag, suppresses advertising and sanitises every page field', () => {
  const m = mock(); const c = createAnalyticsController(m.browser, id); c.choose('granted'); c.choose('granted');
  assert.equal(m.scripts.length, 1); assert.equal(m.scripts[0].referrerPolicy, 'no-referrer');
  const commands = m.browser.dataLayer.map(args => Array.from(args));
  const config = commands.find(args => args[0] === 'config')[2];
  assert.equal(config.page_location, 'https://rikki.kiwi/about/');
  assert.equal(config.page_referrer, ''); assert.equal(config.page_title, 'About — Rikki G');
  assert.equal(config.allow_google_signals, false); assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.cookie_expires, 0); assert.equal(config.cookie_domain, 'none');
  assert.equal(commands[0][2].analytics_storage, 'denied');
  assert.equal(commands.find(args => args[1] === 'update')[2].ad_user_data, 'denied');
  assert(!JSON.stringify(commands).includes('private'));
});
test('remembered consent works across full static-page navigation', () => {
  const m = mock({ saved: 'granted', pathname: '/journal/' });
  assert.equal(createAnalyticsController(m.browser, id).restore(), 'granted'); assert.equal(m.scripts.length, 1);
});
test('unknown routes never disclose path, title, query or fragment', () => {
  const m = mock({ pathname: '/private-token/' }); createAnalyticsController(m.browser, id).choose('granted');
  const config = m.browser.dataLayer.map(args => Array.from(args)).find(args => args[0] === 'config')[2];
  assert.equal(config.page_location, 'https://rikki.kiwi/404/'); assert.equal(config.page_title, 'Page not found — Rikki G');
});
test('localhost, lookalike hosts, HTTP, privacy signals and blocked storage fail safely', () => {
  for (const options of [{ hostname: 'localhost' }, { hostname: '127.0.0.1' }, { hostname: 'rikki.kiwi.example.com' }, { protocol: 'http:' }, { privacy: true }, { dnt: true }]) {
    const m = mock({ ...options, saved: 'granted' }); const c = createAnalyticsController(m.browser, id);
    c.restore(); c.choose('granted'); assert.equal(m.scripts.length, 0); assert.equal(m.stored.size, 1); assert.equal(m.writes.length, 0);
  }
  const m = mock({ storageBlocked: true }); const c = createAnalyticsController(m.browser, id);
  assert.equal(c.restore(), null); assert.equal(m.scripts.length, 0); c.choose('granted'); assert.equal(m.scripts.length, 1);
  assert.equal(analyticsAvailability(mock({ hostname: 'www.rikki.kiwi' }).browser), 'production');
});
test('withdrawal disables collection immediately, clears pending events and only owned cookies', () => {
  const m = mock(); const c = createAnalyticsController(m.browser, id); c.choose('granted'); c.choose('denied');
  assert.equal(m.browser[`ga-disable-${id}`], true); assert.equal(m.browser.dataLayer.length, 0);
  assert.equal(m.writes.length, 2); assert(m.writes.every(value => !value.startsWith('unrelated')));
  c.choose('granted'); assert.equal(m.browser[`ga-disable-${id}`], false); assert.equal(m.scripts.length, 1);
});
