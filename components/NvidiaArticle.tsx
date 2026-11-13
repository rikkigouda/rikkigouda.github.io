import { Fragment } from 'react';
import data from '@/content/nvidia-investigation.json';
import site from '@/content/site.json';
import { Frame } from './Frame';
import { ShareArticleLink, RelationshipGraph, MarketChart } from './InvestigationTools';
import { SourceReferences } from './SourceReferences';
import { CondensedTimeline, SourcedFlowDiagram } from './InvestigationStory';
import { NotebookEntryLink, ReadingProgress } from './InvestigationNavigation';
export const investigationPath = `/journal/${data.article.slug}/`;
export const notebookPath = `${investigationPath}notebook/`;
export const investigationMetadata = {
  title: data.article.title, description: data.article.subtitle, alternates: { canonical: investigationPath }, robots: site.review ? { index: false, follow: false } : undefined,
  openGraph: { type: 'article' as const, title: data.article.title, description: data.article.subtitle, url: investigationPath, publishedTime: data.article.datePublished, modifiedTime: data.article.dateModified, authors: [data.article.author], images: [{ url: '/nvidia-investigation-preview.png', width: 1200, height: 630, alt: 'NVIDIA: decisions, dependencies and evidence. An investigation by Rikki G.' }] },
  twitter: { card: 'summary_large_image' as const, title: data.article.title, description: data.article.subtitle, images: ['/nvidia-investigation-preview.png'] },
};
const formatDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-NZ', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });
export function NvidiaArticle() {
  const { article } = data;
  const numbers = Object.fromEntries(data.sources.map((s, i) => [s.id, i + 1]));
  const currentIds = new Set([...article.sections.map(s => s.id), 'timeline', 'relationships', 'financial-dependencies', 'market', ...data.condensedTimelineIds.map(id => `event-${id}`)]);
  const legacy = data.legacyAnchors.filter(id => !currentIds.has(id));
  const citations = [...new Set(article.sections.flatMap(s => s.paragraphs.flatMap(p => p.sources)))];
  const structuredData = { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.subtitle, author: { '@type': 'Person', name: article.author }, dateCreated: article.dateCreated, datePublished: article.datePublished, dateModified: article.dateModified, inLanguage: 'en-NZ', wordCount: article.wordCount, creativeWorkStatus: article.status === 'published' ? 'Published' : 'Draft revision', mainEntityOfPage: `${site.url}${investigationPath}`, image: `${site.url}/nvidia-investigation-preview.png`, citation: data.sources.filter(s => citations.includes(s.id)).map(s => s.url) };
  return <Frame current="/journal/"><article className="article investigation-article"><ReadingProgress /><a className="text-link" href="/journal/">← Journal</a><p className="eyebrow article-category">Engineering / Industry</p><h1>{article.title}</h1><p className="article-lead">{article.subtitle}</p><div className="investigation-byline"><span>By {article.author}</span><span>First published <time dateTime={article.datePublished}>{formatDate(article.datePublished)}</time></span><span>Revised <time dateTime={article.dateModified}>{formatDate(article.dateModified)}</time></span><span>{article.readingMinutes} min read</span></div>
    {article.status !== 'published' && <p className="revision-notice">Local revision for review. The published article has not been updated.</p>}
    <p className="investigation-disclosure-brief">{article.disclosure} <a href={`${notebookPath}#methodology`} target="_blank" rel="noreferrer">Open notebook (new tab)</a></p>
    <nav className="investigation-toc" aria-label="Article contents"><h2>Five chapters</h2><ol>{article.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol></nav>
    <div className="investigation-reading" id="article-reading">{article.sections.map(section => <section key={section.id} id={section.id} className="prose"><h2>{section.title}</h2>{section.paragraphs.map((p, i) => <Fragment key={i}><p>{p.text}{p.sources.length > 0 && <> <SourceReferences ids={p.sources} basePath={notebookPath} newTab numbers={numbers} /></>}</p>{p.claims.includes('EMC15') && <MarketChart market={data.market} sourcePath={notebookPath} />}</Fragment>)}{section.id === 'the-visible-crisis' && <CondensedTimeline />}{section.id === 'follow-the-chips' && <RelationshipGraph edges={data.relationships} initialGroup="corporate" initialFocus="Megaspeed" sourcePath={notebookPath} embedded />}{section.id === 'follow-the-money' && <SourcedFlowDiagram type="financial" />}</section>)}</div>
    <aside className="notebook-gateway" aria-labelledby="notebook-heading">{legacy.map(id => <span key={id} id={id} className="legacy-anchor" />)}<h2 id="notebook-heading">Investigation Notebook</h2><p>The detailed chronology and relationship records, exact market data, source qualifications and research methods are in the evidence appendix. Links open in a new tab so you can keep your place in the article.</p><NotebookEntryLink path={notebookPath} anchors={data.legacyAnchors} /></aside>
    <div className="investigation-end"><ShareArticleLink url={`${site.url}${investigationPath}`} /><a className="text-link" href="#main">Back to the beginning ↑</a></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
  </article></Frame>;
}
