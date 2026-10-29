import { Frame } from '@/components/Frame';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/content/projects';
export const metadata = { title: 'Portfolio', description: 'Built work and clearly labelled design studies in engineering and architecture.', alternates: { canonical: '/work/' } };
export default function Portfolio() {
  return <Frame current="/work/"><section className="page-intro"><p className="eyebrow">Portfolio</p><h1>Ideas made<br /><em>concrete.</em></h1><p>Built work and design studies that make a question, an approach and a result easy to explore.</p></section><div className="project-grid portfolio-grid">{projects.map(project => <ProjectCard key={project.slug} project={project} />)}</div><aside className="privacy-note"><h2>Share the thinking. Protect the context.</h2><p>These entries distinguish built work from general design exercises. There are no client names, people names or identifiable employment stories. The studies do not claim client delivery or business results.</p></aside></Frame>;
}
