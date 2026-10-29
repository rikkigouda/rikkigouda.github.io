import { Frame } from '@/components/Frame';
import { OfficeStandee } from '@/components/OfficeStandee';
export const metadata = { title: 'About', description: 'Rikki G: helping people grow through clear technical decisions, thoughtful architecture and shared ownership.', alternates: { canonical: '/about/' } };
export default function About() {
  return <Frame current="/about/">
    <section className="about-profile executive-profile">
      <figure className="about-portrait executive-portrait">
        <img src="/rikki-portrait.webp" width="900" height="900" fetchPriority="high" alt="Rikki G in his original portrait, wearing a navy jacket and light-blue shirt with arms folded." />
        <figcaption><span>Rikki G</span><p>Engineering &amp; architecture</p></figcaption>
      </figure>
      <div className="about-profile-copy">
        <p className="eyebrow">About / Technical leadership</p>
        <h1>Clear decisions.<br /><em>Capable teams.</em></h1>
        <p className="about-profile-lead">I help people grow, make sound technical decisions and build systems they can trust.</p>
        <div className="prose">
          <p>My focus is the connection between technical direction and the people who carry it forward. Architecture gives a team a direction; shared understanding gives people the confidence to act on it.</p>
          <p>I start with purpose and constraints, make the options and trade-offs visible, and work towards a practical next step. That means giving equal attention to the quality of a decision, the capability of the team and the consequences of delivery.</p>
        </div>
        <div className="hero-links"><a className="primary-link" href="/work/">Explore my approach <span aria-hidden="true">↗</span></a><a className="text-link" href="https://www.linkedin.com/in/rikkigouda/" rel="noreferrer">Start a conversation ↗</a></div>
      </div>
    </section>
    <section className="about-contribution" aria-labelledby="contribution-heading">
      <div><p className="eyebrow">Where I contribute</p><h2 id="contribution-heading">Direction, ownership<br />and a way forward.</h2></div>
      <dl>
        <div><dt>Technical direction</dt><dd>Connect architecture choices to the purpose they serve. Make constraints, risks and alternatives understandable before committing to a path.</dd></div>
        <div><dt>People &amp; ownership</dt><dd>Build shared understanding, make room for questions and give people the context to take responsibility for decisions.</dd></div>
        <div><dt>Responsible delivery</dt><dd>Consider change, verification and recovery as part of the design. Make the next step clear enough to put into practice.</dd></div>
      </dl>
    </section>
    <section className="about-evidence" aria-labelledby="thinking-heading"><p className="eyebrow">Judgment made visible</p><h2 id="thinking-heading">Explore the thinking.</h2><p>The portfolio separates built work from general design studies. These examples make the reasoning available without turning private engagements into public case studies.</p><div className="profile-links"><a href="/work/a-decision-that-travels/">Architecture decision study ↗</a><a href="/work/a-release-with-a-way-back/">Release &amp; recovery study ↗</a></div></section>
    <details className="about-playful"><summary><span>A lighter side</span><span>The office edition <span aria-hidden="true">＋</span></span></summary><div className="about-playful-content"><OfficeStandee /><div><p className="eyebrow">A little personality</p><h2>Serious about the work.<br /><em>Room for a little humour.</em></h2><p>A playful cardboard companion for the corner of the office. The real conversation is still more useful.</p><a className="text-link" href="https://www.linkedin.com/in/rikkigouda/" rel="noreferrer">Talk to the real Rikki ↗</a></div></div></details>
    <section className="connect-note"><p>A technical decision worth exploring?</p><a href="https://www.linkedin.com/in/rikkigouda/" rel="noreferrer">Let’s talk ↗</a></section>
  </Frame>;
}
