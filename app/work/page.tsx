import { Frame } from '@/components/Frame';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/content/projects';
export const metadata = { title: 'Work & studies', description: 'Built work and clearly labelled design studies in engineering and architecture.', alternates: { canonical: '/work/' } };
export default function Portfolio() {
  return <Frame current="/work/"><section className="page-intro"><p className="eyebrow">Work &amp; studies</p><h1>A problem,<br /><em>worked through.</em></h1><p>The site itself is built work. The other entries are teaching examples, showing the choices and costs behind a design.</p></section><div className="project-grid portfolio-grid">{projects.map(project => <ProjectCard key={project.slug} project={project} />)}</div></Frame>;
}
