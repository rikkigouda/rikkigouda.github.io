'use client';

import { useState } from 'react';
import type investigation from '@/content/nvidia-investigation.json';
import { SourceReferences } from './SourceReferences';

type Data = typeof investigation;
const unique = (values: string[]) => [...new Set(values)];
export function EvidenceBadge({ value }: { value: string }) {
  return <span className={`evidence-badge evidence-${value.toLowerCase()}`}>{value}</span>;
}
export function EvidenceDate({ value }: { value: string | null }) {
  if (!value) return <>Not established</>;
  if (/^\d{4}-Q/.test(value)) return <>{value.replace('-', ' ')}</>;
  const precision = /^\d{4}-\d{2}-\d{2}$/.test(value) ? 'day' : /^\d{4}-\d{2}$/.test(value) ? 'month' : 'year';
  const date = new Date(`${value}${precision === 'year' ? '-01-01' : precision === 'month' ? '-01' : ''}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return <>{value}</>;
  return <time dateTime={value}>{date.toLocaleDateString('en-NZ', { timeZone: 'UTC', year: 'numeric', month: precision !== 'year' ? 'long' : undefined, day: precision === 'day' ? 'numeric' : undefined })}{precision !== 'day' ? ' (date approximate)' : ''}</time>;
}

export function InvestigationTimeline({ events, title = 'Two clocks, one timeline.', sourcePath = '', embedded = false }: { events: Data['timeline']; title?: string; sourcePath?: string; embedded?: boolean }) {
  const [topic, setTopic] = useState('all');
  const [year, setYear] = useState('all');
  const topics = unique(events.map(e => e.topic)).sort();
  const years = unique(events.map(e => e.event_date?.slice(0, 4) || 'undated')).sort();
  const visible = events.filter(e => (topic === 'all' || e.topic === topic) && (year === 'all' || (e.event_date?.slice(0, 4) || 'undated') === year));
  const Heading = embedded ? 'h3' : 'h2';
  return <section id="timeline" className="investigation-tool" aria-labelledby="timeline-heading">
    <p className="eyebrow">The chronology</p><Heading id="timeline-heading">{title}</Heading>
    <p>Event dates and source dates answer different questions. A source date is the cited record&apos;s publication, not necessarily the first public disclosure. Partial dates preserve the available precision; an undated event stays undated.</p>
    <div className="investigation-controls"><label>Topic<select aria-label="Topic" value={topic} onChange={e => setTopic(e.target.value)}><option value="all">All topics</option>{topics.map(t => <option key={t}>{t}</option>)}</select></label><label>Event year<select aria-label="Event year" value={year} onChange={e => setYear(e.target.value)}><option value="all">All years</option>{years.map(y => <option key={y}>{y}</option>)}</select></label><button type="button" onClick={() => { setTopic('all'); setYear('all'); }}>Reset timeline</button></div>
    <p role="status" className="tool-status">{visible.length} of {events.length} events</p>
    {visible.length ? <ol className="investigation-timeline">{visible.map(e => <li key={e.id} id={`event-${e.id}`}><details><summary><span className="timeline-date"><EvidenceDate value={e.event_date} /></span><span className="timeline-title">{e.description}<span className="timeline-meta"><EvidenceBadge value={e.classification} /> · {e.topic}</span></span></summary><div className="timeline-detail">{!embedded && <><dl><div><dt>Event date</dt><dd><EvidenceDate value={e.event_date} /></dd></div><div><dt>Source published</dt><dd><EvidenceDate value={e.publication_date} /></dd></div><div><dt>Confidence in wording</dt><dd>{e.confidence}</dd></div><div><dt>Relevant parties</dt><dd>{e.parties.join('; ')}</dd></div></dl><p><strong>Open question:</strong> {e.outstanding_questions.join(' ')}</p></>}{embedded && <p>Source published <EvidenceDate value={e.publication_date} />. <a href={`${sourcePath}#event-${e.id}`} target="_blank" rel="noreferrer">Detailed evidence record (new tab)</a></p>}<SourceReferences basePath={sourcePath} newTab={Boolean(sourcePath)} ids={e.source_ids} /></div></details></li>)}</ol> : <p>No events match these filters. Reset the timeline to see all events.</p>}
  </section>;
}

function shortName(name: string) {
  const aliases: Record<string, string> = { '7Road International Pte.Ltd. (later Megaspeed)': '7Road Singapore (historical)', 'Wachtell Lipton Rosen & Katz': 'Wachtell Lipton', 'Brownstein Hyatt Farber Schreck': 'Brownstein', 'SPF and Singapore Customs': 'Singapore authorities', 'MITI and Malaysian Customs': 'Malaysian authorities', 'NVIDIA independent directors': 'Independent directors', 'Infrastructure financiers': 'Infrastructure financiers' };
  return aliases[name] || name;
}
function labelLines(text: string) {
  const words = shortName(text).split(' '); const lines: string[] = [];
  for (const word of words) { if (!lines.length || (lines[lines.length - 1] + ' ' + word).length > 22) lines.push(word); else lines[lines.length - 1] += ' ' + word; }
  return lines;
}
function RelationshipRows({ edges, sourcePath = '' }: { edges: Data['relationships']; sourcePath?: string }) {
  return <ul className="relationship-list">{edges.map(r => <li key={r.id}><p><strong>{r.from}</strong> <span aria-label="to">→</span> <strong>{r.to}</strong></p><p>{r.label}{r.subject ? `; subject: ${r.subject}` : ''}{r.asOf ? <> · <EvidenceDate value={r.asOf} /></> : null}</p><p><EvidenceBadge value={r.classification} /> <SourceReferences basePath={sourcePath} newTab={Boolean(sourcePath)} ids={r.sources} />{r.contradictingSources.length > 0 && <> Response: <SourceReferences basePath={sourcePath} newTab={Boolean(sourcePath)} ids={r.contradictingSources} /></>}</p></li>)}</ul>;
}
export function RelationshipGraph({ edges, initialGroup = 'economics', initialFocus = 'NVIDIA', sourcePath = '', embedded = false }: { edges: Data['relationships']; initialGroup?: string; initialFocus?: string; sourcePath?: string; embedded?: boolean }) {
  const [group, setGroup] = useState(initialGroup);
  const [focus, setFocus] = useState(initialFocus);
  const Heading = embedded ? 'h3' : 'h2';
  const groups = { economics: 'Capital and services', corporate: 'Corporate history', oversight: 'Government and governance' };
  const inGroup = edges.filter(r => r.group === group);
  const names = unique(inGroup.flatMap(r => [r.from, r.to])).sort();
  const selected = inGroup.filter(r => r.from === focus || r.to === focus);
  const neighbours = unique(selected.flatMap(r => [r.from, r.to])).filter(n => n !== focus);
  const nodes = [{ name: focus, x: 420, y: 270 }, ...neighbours.map((name, i) => ({ name, x: 420 + 285 * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / neighbours.length), y: 270 + 195 * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / neighbours.length) }))];
  return <section id="relationships" className="investigation-tool" aria-labelledby="relationships-heading"><p className="eyebrow">The dependency map</p><Heading id="relationships-heading">Explore the relationships</Heading><p>Choose a network and an entity. Arrows follow the relationship descriptions below; they do not all represent money or hardware. A line groups the listed relationships between two entities. Connections do not imply wrongdoing. Registered ownership and beneficial control are separate questions.</p>
    <div className="investigation-controls"><label>Network<select aria-label="Network" value={group} onChange={e => { setGroup(e.target.value); setFocus(e.target.value === 'corporate' ? 'Megaspeed' : e.target.value === 'oversight' ? 'NVIDIA board' : 'NVIDIA'); }}>{Object.entries(groups).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Entity<select aria-label="Entity" value={focus} onChange={e => setFocus(e.target.value)}>{names.map(name => <option key={name}>{name}</option>)}</select></label></div>
    <p className="graph-legend">Solid: established for the stated scope. Dashed: reported, alleged, disputed or inferred. Read the evidence label on each relationship.</p>
    <figure className="relationship-figure"><svg viewBox="0 0 840 540" role="img" aria-labelledby="relationship-svg-title relationship-svg-desc"><title id="relationship-svg-title">{`Relationships involving ${focus}`}</title><desc id="relationship-svg-desc">{`${selected.length} sourced relationships. The list immediately below gives direction, meaning, classification and references for every connection.`}</desc>
      {nodes.slice(1).map(n => { const related = selected.filter(r => r.from === n.name || r.to === n.name); const isEstablished = related.every(r => r.classification === 'Established'); return <g key={n.name} className={isEstablished ? 'graph-established' : 'graph-unresolved'}><line x1={420} y1={270} x2={n.x} y2={n.y} /><text x={(420 + n.x) / 2} y={(270 + n.y) / 2 - 7} textAnchor="middle">{related.length} {related.length === 1 ? 'link' : 'links'}</text></g>; })}
      {nodes.map((n, i) => <g key={n.name} className={i === 0 ? 'graph-node graph-centre' : 'graph-node'}><rect x={n.x - 107} y={n.y - 34} width={214} height={68} rx={8} /><text x={n.x} y={n.y - (labelLines(n.name).length - 1) * 9 + 5} textAnchor="middle">{labelLines(n.name).map((line, index) => <tspan key={index} x={n.x} dy={index ? 18 : 0}>{line}</tspan>)}</text></g>)}
    </svg><figcaption>The graph is a visual index. The directed, sourced descriptions are the authoritative reading of each edge.</figcaption></figure>
    <p role="status" className="tool-status">{selected.length} relationships involving {focus}</p><RelationshipRows edges={selected} sourcePath={sourcePath} />
    {embedded ? <p><a href={`${sourcePath}#relationships`} target="_blank" rel="noreferrer">All {edges.length} relationship records and their evidence in the appendix (new tab)</a></p> : <details className="all-relationships"><summary>Read all {edges.length} relationships, across all networks</summary><RelationshipRows edges={edges} sourcePath={sourcePath} /></details>}
  </section>;
}

export function MarketChart({ market, sourcePath = '' }: { market: Data['market']; sourcePath?: string }) {
  const [symbol, setSymbol] = useState('all');
  const visible = market.series.filter(s => symbol === 'all' || symbol === s.symbol);
  const dates = market.series[0]?.rows.map(r => r.date) || [];
  if (dates.length < 2 || market.series.some(s => s.rows.length !== dates.length)) return <p>Aligned market data is unavailable. Source references remain available below.</p>;
  const x = (date: string) => 65 + (Date.parse(date) - Date.parse(dates[0])) / (Date.parse(dates[dates.length - 1]) - Date.parse(dates[0])) * 620;
  const values = market.series.flatMap(s => s.rows.map(r => r.normalized_index));
  const low = Math.floor(Math.min(...values) / 5) * 5 - 5;
  const high = Math.ceil(Math.max(...values) / 5) * 5 + 5;
  const y = (value: number) => 45 + (high - value) / (high - low) * 260;
  const ticks = Array.from({ length: Math.floor((high - low) / 10) + 1 }, (_, i) => low + i * 10);
  return <aside className="investigation-tool market-tool" aria-labelledby="market-heading" id="market"><p className="eyebrow">Market context</p><h3 id="market-heading">Seven completed sessions.</h3><p>Adjusted close, indexed to 100 on 4 November 2026. Daily closes through 12 November only; no interpolation. Calendar spacing preserves the weekend. Price changes do not establish causation.</p>
    <label className="market-select">Show series<select aria-label="Show series" value={symbol} onChange={e => setSymbol(e.target.value)}><option value="all">All four series</option>{market.series.map(s => <option key={s.symbol}>{s.symbol}</option>)}</select></label>
    <figure tabIndex={0} role="region" aria-label="Market comparison chart, scroll horizontally"><svg viewBox="0 0 760 420" role="img" aria-labelledby="market-svg-title market-svg-desc"><title id="market-svg-title">NVDA, AMD, AVGO and SOXX adjusted-close comparison, 4–12 November 2026</title><desc id="market-svg-desc">Index 100 on 4 November. NVIDIA finishes at 83.04, AMD 119.75, Broadcom 111.95 and SOXX 103.23. Exact USD closes and volumes are linked in the evidence appendix.</desc>
      {ticks.map(t => <g className="market-grid" key={t}><line x1={65} x2={685} y1={y(t)} y2={y(t)} /><text x={53} y={y(t) + 5} textAnchor="end">{t}</text></g>)}
      <g className="market-events"><line x1={x('2026-11-08')} x2={x('2026-11-08')} y1={30} y2={312} /><text x={x('2026-11-08')} y={330} textAnchor="middle">8 Nov: inquiry</text><line x1={x('2026-11-12')} x2={x('2026-11-12')} y1={30} y2={312} /><text x={x('2026-11-12')} y={352} textAnchor="end">12 Nov: transition announced</text></g>
      {visible.map(s => <g key={s.symbol} className={`market-series market-${s.symbol.toLowerCase()}`}><polyline points={s.rows.map(r => `${x(r.date)},${y(r.normalized_index)}`).join(' ')} />{s.rows.map(r => <circle key={r.date} cx={x(r.date)} cy={y(r.normalized_index)} r={3}><title>{`${s.symbol}, ${r.date}: $${r.adjusted_close.toFixed(2)}; index ${r.normalized_index.toFixed(2)}`}</title></circle>)}</g>)}
      <g className="market-axis">{[dates[0],dates[2],dates[4],dates[6]].filter(Boolean).map(d => <text key={d} x={x(d)} y={378} textAnchor="middle">{Number(d.slice(-2))} Nov</text>)}<text x={65} y={405}>US trading dates (America/New_York); USD closes</text></g>
    </svg><figcaption><span className="market-key market-nvda">━ NVDA</span><span className="market-key market-amd">┄ AMD</span><span className="market-key market-avgo">┈ AVGO</span><span className="market-key market-soxx">┅ SOXX</span></figcaption></figure>
    <p className="tool-status">Completed sessions through 12 November. Calculation notes, adjustment limits and exact observations are in the evidence appendix.</p>
    <p><a href={`${sourcePath}#market`} target="_blank" rel="noreferrer">Exact prices, volumes and calculation notes in the evidence appendix (new tab)</a></p>
    <p>Data: Stock Analysis, attributing S&amp;P Global Market Intelligence; retrieved 14 November 2026. <SourceReferences basePath={sourcePath} newTab={Boolean(sourcePath)} ids={market.series.map(s => s.source_id)} /> SOXX close and volume also checked against issuer data. <SourceReferences basePath={sourcePath} newTab={Boolean(sourcePath)} ids={['RS01']} /></p><p>Event markers: <SourceReferences basePath={sourcePath} newTab={Boolean(sourcePath)} ids={['PG04','PG01','PG02']} /></p>
  </aside>;
}

export function EvidenceExplorer({ claims, contradictions, questions }: Pick<Data, 'claims' | 'contradictions' | 'questions'>) {
  const [query, setQuery] = useState(''); const [classification, setClassification] = useState('all');
  const visible = claims.filter(c => (classification === 'all' || c.classification === classification) && `${c.text} ${c.id}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="investigation-tool" id="evidence" aria-labelledby="evidence-heading"><p className="eyebrow">Check the argument</p><h2 id="evidence-heading">Claims, evidence and open questions.</h2><p>Established means documented for the precise wording. Reported means attributed reporting. Alleged means an unresolved accusation. Inferred means analysis. Speculative lacks sufficient support. Disputed means materially conflicting accounts. High confidence in an attributed statement does not confirm the underlying allegation.</p>
    <div className="investigation-controls"><label>Search claims<input aria-label="Search claims" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Company, date or claim ID" /></label><label>Evidence class<select aria-label="Evidence class" value={classification} onChange={e => setClassification(e.target.value)}><option value="all">All classifications</option>{['Established','Reported','Alleged','Inferred','Speculative','Disputed'].map(c => <option key={c}>{c}</option>)}</select></label><button type="button" onClick={() => { setQuery(''); setClassification('all'); }}>Reset evidence</button></div>
    <p role="status" className="tool-status">{visible.length} of {claims.length} reviewed claims</p><div className="evidence-claims">{visible.map(c => <details key={c.id} id={`claim-${c.id}`}><summary><span><span className="claim-id">{c.id}</span> {c.text}</span><EvidenceBadge value={c.classification} /></summary><div className="claim-detail"><p>Confidence in wording: {c.confidence}. Event: <EvidenceDate value={c.eventDate} />. Source date: <EvidenceDate value={c.sourceDate} />.</p><p>Supporting sources: <SourceReferences ids={c.sources} /></p><p>Contradicting sources: {c.contradictingSources.length ? <SourceReferences ids={c.contradictingSources} /> : 'No directly contradicting source registered for this precise wording. Read the qualifications and unresolved issues below.'}</p></div></details>)}{!visible.length && <p>No claims match these filters. Reset the evidence to see all reviewed claims.</p>}</div>
    <h3>Contradictions and qualifications</h3><ul className="qualification-list">{contradictions.map(c => <li key={c.title}><strong>{c.title}.</strong> {c.text} <SourceReferences ids={c.sources} /></li>)}</ul><h3>Unresolved questions</h3><ol className="qualification-list">{questions.map(q => <li key={q}>{q}</li>)}</ol>
  </section>;
}

export function ShareArticleLink({ url }: { url: string }) {
  const [message, setMessage] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(url); setMessage('Article link copied.'); }
    catch { setMessage(`Article address: ${url}`); }
  }
  return <div className="article-sharing"><button type="button" onClick={copy}>Copy article link</button><span role="status">{message}</span></div>;
}
