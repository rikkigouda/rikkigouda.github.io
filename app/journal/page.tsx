import { Frame } from '@/components/Frame';
import posts from '@/content/posts.json';
export const metadata = { title: 'Journal', description: 'Notes on privacy, shared understanding and the thinking behind engineering decisions.', alternates: { canonical: '/journal/' } };
export default function Journal() {
  return <Frame current="/journal/"><section className="page-intro"><p className="eyebrow">Journal</p><h1>A little room<br /><em>to think.</em></h1><p>Notes that take one question far enough to try something with it.</p></section><div className="journal-list">{posts.map((post, index) => <a className="journal-list-entry" href={`/journal/${post.slug}/`} key={post.slug}><span className="interest-number">0{index + 1}</span><div><div className="entry-top"><span className="eyebrow">{post.category}</span></div><h2>{post.title}</h2><p>{post.summary}</p></div><span aria-hidden="true">↗</span></a>)}</div><p className="editorial-note">Examples are labelled where they are invented.</p></Frame>;
}
