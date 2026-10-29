import { ProjectArt } from './ProjectArt';
import { projects } from '@/content/projects';
export function ProjectCard({ project }: { project: typeof projects[number] }) {
  return <a className="project-card" href={`/work/${project.slug}/`}><ProjectArt kind={project.kind} /><div className="project-card-meta"><span className="eyebrow">{project.category}</span><span className="draft-tag">{project.status}</span></div><h3>{project.title}</h3><p>{project.summary}</p><span className="read-link">Explore the project <span aria-hidden="true">↗</span></span></a>;
}
