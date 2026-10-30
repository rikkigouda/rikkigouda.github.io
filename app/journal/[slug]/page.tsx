import { notFound } from 'next/navigation';
import { Frame } from '@/components/Frame';
import posts from '@/content/posts.json';
export const dynamicParams = false;
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = posts.find(item => item.slug === slug); return { title: post?.title ?? 'Journal', description: post?.summary, alternates: { canonical: `/journal/${slug}/` } }; }
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = posts.find(item => item.slug === slug); if (!post) notFound();
  const next = posts.find(item => item.slug !== slug)!;
  return <Frame current="/journal/"><article className="article"><a className="text-link" href="/journal/">← Journal</a><p className="eyebrow article-category">{post.category}</p><h1>{post.title}</h1><p className="article-lead">{post.summary}</p><div className="prose">{post.blocks.map((block, index) => block.kind === 'h2' ? <h2 key={index}>{block.text}</h2> : <p key={index}>{block.text}</p>)}</div><div className="article-next"><span className="eyebrow">Another thought</span><a href={`/journal/${next.slug}/`}>{next.title} ↗</a></div></article></Frame>;
}
