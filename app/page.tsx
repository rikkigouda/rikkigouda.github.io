import { Frame } from '@/components/Frame';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/content/projects';
import { GrowthTree } from '@/components/GrowthTree';
import { perspectives } from '@/content/perspectives';
export const metadata = { title: 'Helping people grow', description: 'A dad, engineer, architect and trader. Different angles on people, decisions, learning and growth.', alternates: { canonical: '/' } };
export default function Home() {
  return <Frame current="/">
    <section className="intro brand-intro"><p className="eyebrow">Rikki G / People. Decisions. Growth.</p><div className="intro-layout"><div><h1>Helping people<br /><em>grow.</em></h1><p className="intro-copy">I’m Rikki. A dad, engineer, architect and trader. This is where I work through ideas about people, technology and the choices we make.</p><p className="intro-sub">You’ll find practical examples, open questions and things I’m still learning.</p><div className="hero-links"><a className="primary-link" href="/perspectives/">Explore the different angles <span aria-hidden="true">↗</span></a><a className="text-link" href="/about/">A little about me →</a></div></div><GrowthTree /></div></section>
    <section className="perspective-preview"><div className="section-topline"><h2>A few things I think about.</h2><a href="/perspectives/">Explore the perspectives ↗</a></div><div className="perspective-cards">{perspectives.map((item, index) => <a className="perspective-card" href={`/perspectives/#${item.id}`} key={item.id}><span className="eyebrow">0{index + 1}</span><h3>{item.title}</h3><p>{item.short}</p><span className="perspective-arrow" aria-hidden="true">↗</span></a>)}</div></section>
    <section className="selected-work"><div className="section-topline"><h2>Selected work & studies</h2><a href="/work/">View the portfolio ↗</a></div><div className="project-grid">{projects.slice(0, 2).map(project => <ProjectCard key={project.slug} project={project} />)}</div></section>
    <section className="journal-preview"><div className="section-topline"><h2>From the journal</h2><a href="/journal/">All notes ↗</a></div><a className="journal-preview-row" href="/journal/before-the-diagram/"><span className="eyebrow">Engineering</span><h3>Before the diagram, ask a better question.</h3><span aria-hidden="true">↗</span></a></section>

  </Frame>;
}
