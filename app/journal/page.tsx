import { Frame } from '@/components/Frame';
import posts from '@/content/posts.json';
export const metadata = { title: 'Journal', description: 'Draft notes and opinions on engineering, architecture and privacy.', alternates: { canonical: '/journal/' } };
export default function Journal() {
  return <Frame current="/journal/"><section className="page-intro"><p className="eyebrow">Journal</p><h1>A little room<br /><em>to think.</em></h1><p>Stories, opinions and open questions. A companion to the work, with space for ideas still taking shape.</p></section><div className="journal-list">{posts.map((post, index) => <a className="journal-list-entry" href={`/journal/${post.slug}/`} key={post.slug}><span className="interest-number">0{index + 1}</span><div><div className="entry-top"><span className="eyebrow">{post.category}</span><span className="draft-tag">Editorial draft</span></div><h2>{post.title}</h2><p>{post.summary}</p></div><span aria-hidden="true">↗</span></a>)}</div><p className="editorial-note">These entries are original editorial drafts for owner review. No real client or employer stories are represented.</p></Frame>;
}
