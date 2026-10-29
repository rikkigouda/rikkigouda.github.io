import { Frame } from '@/components/Frame';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/content/projects';
import { GrowthTree } from '@/components/GrowthTree';
export const metadata = { title: 'Helping people grow — Rikki G', description: 'Helping people grow through thoughtful engineering, clear architecture and shared capability.', alternates: { canonical: '/' } };
export default function Home() {
  return <Frame current="/">
    <section className="intro brand-intro"><p className="eyebrow">Rikki G / Engineering & architecture</p><div className="intro-layout"><div><h1>Helping people<br /><em>grow.</em></h1><p className="intro-copy">I help teams make clear technical decisions, build capability and create technology that supports their purpose.</p><p className="intro-sub">Technical direction. Shared ownership. Thoughtful delivery.</p><div className="hero-links"><a className="primary-link" href="/work/">Explore the portfolio <span aria-hidden="true">↗</span></a><a className="text-link" href="/about/">My approach to leadership →</a></div></div><GrowthTree /></div></section>
    <section className="selected-work"><div className="section-topline"><h2>Selected work & studies</h2><a href="/work/">View the portfolio ↗</a></div><div className="project-grid">{projects.slice(0, 2).map(project => <ProjectCard key={project.slug} project={project} />)}</div></section>
    <section className="capability-strip"><p className="eyebrow">How I approach the work</p><div><article><h3>Find the real question.</h3><p>Understand the purpose and constraints before choosing the shape of the solution.</p></article><article><h3>Make the reasoning visible.</h3><p>Give people a clear view of the decisions, dependencies and trade-offs.</p></article><article><h3>Build a way forward.</h3><p>Turn a promising idea into something people can understand, use and improve.</p></article></div></section>
    <section className="journal-preview"><div className="section-topline"><h2>From the journal</h2><a href="/journal/">All notes ↗</a></div><a className="journal-preview-row" href="/journal/before-the-diagram/"><span className="eyebrow">Engineering / Draft</span><h3>Before the diagram, ask a better question.</h3><span aria-hidden="true">↗</span></a></section>
    <section className="connect-note"><p>Have a question worth exploring?</p><a href="https://www.linkedin.com/in/rikkigouda/" rel="noreferrer">Let’s connect ↗</a></section>
  </Frame>;
}
