import { notFound } from 'next/navigation';
import { Frame } from '@/components/Frame';
import { ProjectArt } from '@/components/ProjectArt';
import { projects } from '@/content/projects';
export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const project = projects.find(item => item.slug === slug); return { title: project?.title ?? 'Project', description: project?.summary, alternates: { canonical: `/work/${slug}/` } }; }
export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = projects.find(item => item.slug === slug); if (!project) notFound();
  return <Frame current="/work/"><article className="case-study"><a className="text-link" href="/work/">← Work</a><div className="case-heading"><p className="eyebrow">{project.category}</p><h1>{project.title}</h1><p className="article-lead">{project.description}</p></div><div className="case-facts"><div><span>Status</span><p>{project.status}</p></div><div><span>Contribution</span><p>{project.role}</p></div></div><ProjectArt kind={project.kind} /><div className="case-body"><section><span className="eyebrow">The question</span><h2>{project.question}</h2></section><section><span className="eyebrow">The approach</span><ol>{project.approach.map(item => <li key={item}>{item}</li>)}</ol></section><section><span className="eyebrow">Worked example</span><ol>{project.example.map(item => <li key={item}>{item}</li>)}</ol></section><section><span className="eyebrow">What this provides</span><p>{project.outcome}</p></section><aside className="privacy-note"><h2>About this example</h2><p>{project.boundary}</p></aside></div><a className="text-link" href="/work/">Explore more work →</a></article></Frame>;
}
