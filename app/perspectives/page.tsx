import { Frame } from '@/components/Frame';
import { perspectives } from '@/content/perspectives';

export const metadata = {
  title: 'Perspectives',
  description: 'Fatherhood, engineering, trading, learning and the questions behind a good decision.',
  alternates: { canonical: '/perspectives/' },
};

export default function Perspectives() {
  return <Frame current="/perspectives/">
    <section className="page-intro perspective-intro">
      <p className="eyebrow">Perspectives / Draft for review</p>
      <h1>How I look<br /><em>at things.</em></h1>
      <p>Some views I hold, some questions I am working through, and a few ways to put them to use.</p>
      <nav className="perspective-index" aria-label="Explore perspectives">{perspectives.map(item => <a href={`#${item.id}`} key={item.id}>{item.title} <span aria-hidden="true">↓</span></a>)}</nav>
    </section>
    <div className="perspective-stories">{perspectives.map((item, index) => <section className="perspective-story" id={item.id} key={item.id} aria-labelledby={`${item.id}-title`}>
      <div><p className="eyebrow">0{index + 1} / Perspective</p><h2 id={`${item.id}-title`}>{item.title}</h2><p className="perspective-question">{item.question}</p></div>
      <div className="prose">{item.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<h3 className="practice-heading">{item.practice}</h3><ul>{item.prompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ul></div>
    </section>)}</div>

  </Frame>;
}
