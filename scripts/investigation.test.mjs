import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('content/nvidia-investigation.json', root), 'utf8'));
const articlePath = `journal/${data.article.slug}/index.html`;
const html = await readFile(new URL(`docs/${articlePath}`, root), 'utf8');
const notebook = await readFile(new URL(`docs/journal/${data.article.slug}/notebook/index.html`, root), 'utf8');
const sources = new Set(data.sources.map(s => s.id));
const claims = new Map(data.claims.map(c => [c.id, c]));

test('every article claim and graph/timeline source resolves, including denials', () => {
  assert.equal(sources.size, data.sources.length);
  assert.equal(claims.size, data.claims.length);
  for (const section of data.article.sections) for (const p of section.paragraphs) {
    for (const id of p.claims) assert(claims.has(id), id);
    const expected = new Set(p.claims.flatMap(id => claims.get(id).sources));
    assert.deepEqual(new Set(p.sources), expected);
  }
  for (const item of [...data.claims, ...data.relationships]) for (const id of [...item.sources, ...item.contradictingSources]) assert(sources.has(id), id);
  for (const e of data.timeline) for (const id of e.source_ids) assert(sources.has(id), id);
  const allegation = data.relationships.find(r => r.id === 'PGR12');
  assert.equal(allegation.classification, 'Alleged');
  assert.deepEqual(allegation.contradictingSources, ['PG20','PG21','RPG01']);
});

test('dates retain precision and distinguish event, disclosure and article publication', () => {
  const transition = data.timeline.find(e => e.id === 'PGT01');
  assert.equal(transition.event_date, '2026-11-11'); assert.equal(transition.publication_date, '2026-11-12');
  assert(data.timeline.some(e => e.event_date === null));
  assert(data.timeline.some(e => /^\d{4}-\d{2}$/.test(e.event_date || '')));
  for (const s of data.sources) { assert(s.accessed <= data.article.cutoff); assert(!s.date || s.date <= data.article.cutoff); }
  assert(['draft','published'].includes(data.article.status));
  assert.equal(data.article.datePublished, '2026-11-14');
});

test('market uses aligned complete sessions, real closes/volume and reproducible indexing', () => {
  const m = data.market;
  assert.equal(m.last_complete_session, '2026-11-12');
  const dates = m.series[0].rows.map(r => r.date);
  for (const s of m.series) {
    assert(sources.has(s.source_id)); assert.deepEqual(s.rows.map(r => r.date), dates);
    for (const r of s.rows) { assert(r.date <= m.last_complete_session); assert(Number.isInteger(r.volume) && r.volume > 0); assert(Math.abs(r.normalized_index - 100 * r.adjusted_close / s.rows[0].adjusted_close) < 1e-6); }
  }
  assert.equal(m.series.find(s => s.symbol === 'NVDA').rows.at(-1).close, 166.19);
  assert(m.excluded_dates.some(e => e.date === '2026-11-13'));
});

test('export contains full prose, anchors and source details without JavaScript', () => {
  for (const section of data.article.sections) { assert(html.includes(`id="${section.id}"`)); for (const p of section.paragraphs) assert(html.includes(p.text.slice(0, 35).replaceAll('&','&amp;').replaceAll("'",'&#x27;')), section.id); }
  for (const s of data.sources) assert(notebook.includes(`id="source-${s.id}"`));
  for (const id of ['timeline','relationships','evidence','references','market']) assert(html.includes(`id="${id}"`));
  assert(notebook.replace(/<!--[\s\S]*?-->/g, '').includes('28 recorded prices and volumes'));
  assert(!html.includes('Search claims') && notebook.includes('Search claims'));
  for (const id of ['hypotheses','research-gaps','methodology','financial-record']) assert(notebook.includes(`id="${id}"`));
  for (const id of data.legacyAnchors) assert(html.includes(`id="${id}"`), `Legacy inbound fragment ${id}`);
});

test('structured data and sitemap preserve editorial review and privacy boundaries', async () => {
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null');
  assert.equal(schema['@type'], 'Article'); assert.equal(schema.headline, data.article.title);
  assert.equal(schema.creativeWorkStatus, data.article.status === 'published' ? 'Published' : 'Draft revision'); assert.equal(schema.datePublished, data.article.datePublished);
  assert.equal(html.includes('Local revision for review'), data.article.status !== 'published');
  assert.equal(notebook.includes('Local revision for review'), data.article.status !== 'published');
  if (data.article.status === 'published') assert(!/Draft revision|Local revision for review|published article has not been updated/i.test(html + notebook));
  assert(html.includes('Copy article link'));
  assert.equal(schema.citation.length, new Set(data.article.sections.flatMap(s => s.paragraphs.flatMap(p => p.sources))).size);
  assert.equal(schema.author.name, 'Rikki G');
  const sitemap = await readFile(new URL('docs/sitemap.xml', root), 'utf8');
  assert(!sitemap.includes(data.article.slug));
  const publicJson = JSON.stringify(data);
  assert(!/editorial_notes|workstreams|supporting_source_ids|[A-Z]:[\\/]|RIKKI_CONTEXT|CAREER_EVIDENCE/.test(publicJson));
  const exported = await readdir(new URL('docs/', root));
  assert(!exported.some(name => ['research','brand','workstreams'].includes(name)));
  assert(html.includes('noindex, nofollow'));
  assert(notebook.includes('noindex, nofollow'));
  assert(notebook.includes(`rel="canonical" href="https://rikki.kiwi/journal/${data.article.slug}/notebook/"`));
});

test('five chapters and compact sourced diagrams preserve scope and opposing responses', () => {
  assert.equal(data.article.sections.length, 5);
  assert.equal(data.condensedTimelineIds.length, 10);
  for (const id of data.condensedTimelineIds) assert(data.timeline.some(e => e.id === id));
  for (const edge of [...data.corporateDiagram, ...data.financialDiagram]) {
    assert(edge.from && edge.to && edge.label && edge.kind);
    assert(edge.sources.length && edge.sources.every(id => sources.has(id)));
    assert(!/Supermicro/.test(edge.from + edge.to), 'No unverified supplier/customer link');
  }
  assert.deepEqual(new Set(data.financialDiagram.map(e => e.kind)), new Set(['hardware','equity','money','compute','debt','ownership','guarantee']));
  assert(data.article.sections.flatMap(s => s.paragraphs).some(p => p.claims.includes('RPGC01')));
  assert(data.article.sections.flatMap(s => s.paragraphs).some(p => p.claims.includes('RVCC01')));
  assert(data.article.sections.flatMap(s => s.paragraphs).some(p => p.text.includes('simplified scenario')));
  assert(html.includes('target="_blank"') && html.includes('Article reading progress'));
});

test('article owns the interactive visuals and the appendix owns the detailed records', () => {
  for (const name of ['Topic','Event year','Network','Entity','Show series','Flow type','Flow organisation']) {
    assert(html.includes(`aria-label="${name}"`), `Article control ${name}`);
    assert(!notebook.includes(`aria-label="${name}"`), `Duplicated control ${name}`);
  }
  assert(html.includes('class="relationship-figure"') && !notebook.includes('class="relationship-figure"'));
  assert(html.includes('class="market-series ') && !notebook.includes('class="market-series '));
  assert(!html.includes('Read all 31 relationships, across all networks'));
  assert(!html.includes('expandable data table'));
  assert(!notebook.includes("I&#x27;ve lived with NVIDIA GPUs"));
  for (const event of data.timeline) assert(notebook.includes(`id="event-${event.id}"`));
  for (const edge of data.relationships) assert(notebook.includes(`id="relationship-${edge.id}"`));
  const market = notebook.match(/<section id="market"[\s\S]*?<\/section>/)?.[0];
  assert(market);
  assert.equal((market.match(/<tr>/g) || []).length, 29, '28 observations and one header row');
  for (const page of [html, notebook]) {
    const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'Each fragment target is unique');
  }
});
