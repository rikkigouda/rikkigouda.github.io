import { Frame } from '@/components/Frame';
import { OfficeStandee } from '@/components/OfficeStandee';
export const metadata = { title: 'About', description: 'Rikki G. A dad, engineer, architect and trader. Still curious, still building and still learning.', alternates: { canonical: '/about/' } };
export default function About() {
  return <Frame current="/about/">
    <section className="about-profile executive-profile">
      <figure className="about-portrait executive-portrait">
        <img src="/rikki-portrait.webp" width="900" height="900" fetchPriority="high" alt="Rikki G in his original portrait, wearing a navy jacket and light-blue shirt with arms folded." />
        <figcaption><span>Rikki G</span></figcaption>
      </figure>
      <div className="about-profile-copy">
        <p className="eyebrow">About / More than the work</p>
        <h1>A little<br /><em>context.</em></h1>
        <p className="about-profile-lead">I enjoy the point where someone stops needing an answer from me and starts finding their own.</p>
        <div className="prose">
          <p>My background is in software engineering, architecture and technical leadership. I still enjoy writing code. Over more than 20 years, the work has also become about helping people understand a problem well enough to take responsibility for it.</p>
          <p>Some of my most useful lessons came from getting things wrong. I would rather explain where my reasoning failed than turn the result into a tidy success story.</p>
          <p>Fatherhood has changed how I think about success outside work. That part of my life belongs here too, while the people in it keep their privacy.</p>
        </div>
        <div className="hero-links"><a className="primary-link" href="/perspectives/">Explore the different angles <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
    <section className="about-evidence" aria-labelledby="thinking-heading"><p className="eyebrow">Reading this site</p><h2 id="thinking-heading">The reasoning, as well as the result.</h2><p>Perspectives sets out the standards I care about. Work takes a specific problem apart. The journal gives a question more room, with examples you can examine and use.</p><div className="profile-links"><a href="/work/">Work and studies ↗</a><a href="/journal/">Read the journal ↗</a></div></section>
    <details className="about-playful"><summary><span>A lighter side</span><span>The office edition <span aria-hidden="true">＋</span></span></summary><div className="about-playful-content"><OfficeStandee /><div><p className="eyebrow">A little personality</p><h2>Serious about the work.<br /><em>Room for a little humour.</em></h2><p>An experiment that got a little out of hand: an office edition, complete with suggested print dimensions.</p></div></div></details>

  </Frame>;
}
