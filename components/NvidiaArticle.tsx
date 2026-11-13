import data from '@/content/nvidia-investigation.json';
import site from '@/content/site.json';
import { Frame } from './Frame';
import { EvidenceExplorer, InvestigationTimeline, MarketChart, RelationshipGraph, ShareArticleLink } from './InvestigationTools';
import { SourceReferences } from './SourceReferences';

export const investigationPath = `/journal/${data.article.slug}/`;
export const investigationMetadata = {
  title: data.article.title,
  description: data.article.subtitle,
  alternates: { canonical: investigationPath },
  robots: site.review ? { index: false, follow: false } : undefined,
  openGraph: { type: 'article' as const, title: data.article.title, description: data.article.subtitle, url: investigationPath, publishedTime: data.article.datePublished ?? undefined, modifiedTime: data.article.dateModified, authors: [data.article.author], images: [{ url: '/nvidia-investigation-preview.png', width: 1200, height: 630, alt: 'NVIDIA: decisions, dependencies and evidence. An investigation by Rikki G.' }] },
  twitter: { card: 'summary_large_image' as const, title: data.article.title, description: data.article.subtitle, images: ['/nvidia-investigation-preview.png'] },
};

export function NvidiaArticle() {
  const { article } = data;
  const structuredData = { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.subtitle, author: { '@type': 'Person', name: article.author }, dateCreated: article.dateCreated, datePublished: article.datePublished, dateModified: article.dateModified, inLanguage: 'en-NZ', wordCount: article.wordCount, creativeWorkStatus: 'Published', mainEntityOfPage: `${site.url}${investigationPath}`, image: `${site.url}/nvidia-investigation-preview.png`, citation: data.sources.map(s => s.url) };
  return <Frame current="/journal/"><article className="article investigation-article"><a className="text-link" href="/journal/">← Journal</a><p className="eyebrow article-category">Engineering / Industry</p><h1>{article.title}</h1><p className="article-lead">{article.subtitle}</p><div className="investigation-byline"><span>By {article.author}</span><span>Published <time dateTime={article.datePublished ?? undefined}>14 November 2026</time></span><span>Updated <time dateTime={article.dateModified}>14 November 2026</time></span><span>{article.readingMinutes} min read</span></div>
    <aside className="investigation-disclosure" aria-label="Editorial disclosure"><p>{article.disclosure}</p></aside>
    <nav className="investigation-toc" aria-label="Article contents"><h2>In this investigation</h2><ol>{article.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol><div><a href="#timeline">Timeline</a><a href="#relationships">Relationship map</a><a href="#market">Market data</a><a href="#evidence">Evidence explorer</a><a href="#references">Sources</a></div></nav>
    <div className="investigation-reading">{article.sections.map(section => <section key={section.id} id={section.id} className="prose"><h2>{section.title}</h2>{section.paragraphs.map((p, i) => <p key={i}>{p.text}{p.sources.length > 0 && <> <SourceReferences ids={p.sources} /></>}</p>)}{section.id === 'prices-and-beneficiaries' && <MarketChart market={data.market} />}</section>)}</div>
    <div className="investigation-appendices"><InvestigationTimeline events={data.timeline} /><RelationshipGraph edges={data.relationships} /><EvidenceExplorer claims={data.claims} contradictions={data.contradictions} questions={data.questions} />
      <section id="references" className="investigation-tool investigation-sources" aria-labelledby="references-heading"><p className="eyebrow">The source record</p><h2 id="references-heading">References and their limits.</h2><p>Sources are linked directly. Syndicated copies are one reporting chain. A company statement establishes what the company said; an oversight letter establishes what lawmakers asked. Neither independently proves every underlying assertion. Undated pages were accessed on 14 November 2026.</p>{data.sources.map(s => <details key={s.id} id={`source-${s.id}`}><summary><span className="claim-id">{s.id}</span><span>{s.title}<span className="source-meta">{s.publisher} · {s.date || 'Undated / rolling'} · {s.status}</span></span></summary><div className="source-detail"><p><a href={s.url} rel="noreferrer">Read source ↗</a></p><p>{s.author ? `Author: ${s.author}. ` : 'Author not identified. '}{s.type}. Accessed {s.accessed}.</p><p><strong>Limitations:</strong> {s.limitation}</p><p><strong>Supporting claims:</strong> {s.claims.length ? s.claims.join(', ') : 'Timeline or relationship evidence.'}</p></div></details>)}</section>
    </div><div className="investigation-end"><ShareArticleLink url={`${site.url}${investigationPath}`} /><a className="text-link" href="#main">Back to the beginning ↑</a></div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
  </article></Frame>;
}
