'use client';
import { useState } from 'react';
import { SourceReferences } from './SourceReferences';
type Flow = { from: string; to: string; kind: string; label: string; classification: string; sources: string[]; qualification?: string };

export function FlowExplorer({ edges, sourcePath, numbers, type }: { edges: Flow[]; sourcePath: string; numbers: Record<string,number>; type: 'financial' }) {
  const [kind, setKind] = useState('all');
  const [entity, setEntity] = useState('all');
  const kinds = [...new Set(edges.map(edge => edge.kind))];
  const entities = [...new Set(edges.flatMap(edge => [edge.from, edge.to]))].sort();
  const visible = edges.filter(edge => (kind === 'all' || edge.kind === kind) && (entity === 'all' || edge.from === entity || edge.to === entity));
  return <figure id="financial-dependencies" className={`story-visual story-map story-map-${type}`} aria-labelledby="financial-dependencies-heading"><figcaption><h3 id="financial-dependencies-heading">Explore the financial dependencies</h3><p>Choose a flow type or an organisation. Each arrow names a specific flow or obligation. The SB Energy/OpenAI campus is a separate project from CoreWeave; these links do not trace particular investment dollars.</p></figcaption>
    <div className="investigation-controls"><label>Flow type<select aria-label="Flow type" value={kind} onChange={event => setKind(event.target.value)}><option value="all">All flow types</option>{kinds.map(value => <option value={value} key={value}>{value}</option>)}</select></label><label>Organisation<select aria-label="Flow organisation" value={entity} onChange={event => setEntity(event.target.value)}><option value="all">All organisations</option>{entities.map(value => <option key={value}>{value}</option>)}</select></label><button type="button" onClick={() => { setKind('all'); setEntity('all'); }}>Reset flows</button></div>
    <p className="tool-status" role="status">{visible.length} of {edges.length} financial relationships</p>
    <ul className="flow-diagram">{visible.map((edge,index) => <li key={`${edge.from}-${edge.to}-${edge.kind}-${index}`} className={`flow-card flow-${edge.kind}`}><p className="flow-kind">{edge.kind}</p><p className="flow-parties"><strong>{edge.from}</strong><span aria-label="to">→</span><strong>{edge.to}</strong></p><p className="flow-label">{edge.label} <SourceReferences ids={edge.sources} basePath={sourcePath} newTab numbers={numbers} /></p>{edge.qualification && <details><summary>Conditions and scope</summary><p>{edge.qualification}</p></details>}</li>)}</ul>
    {!visible.length && <p>No relationships match these filters. Reset flows to see the complete diagram.</p>}
    <p className="tool-status">Every connection is sourced. Card position implies no additional relationship. The text and arrows remain available on mobile and without JavaScript.</p>
  </figure>;
}
