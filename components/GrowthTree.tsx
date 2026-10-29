'use client';

import { useEffect, useRef, useState } from 'react';
import { CanopyBreeze } from './CanopyBreeze';

export function GrowthTree() {
  const [generation, setGeneration] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const figure = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    let inView = true;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);

  return <figure ref={figure} className="growth-tree living-tree natural-tree" data-paused={paused || !visible}>
    <div key={generation} className="natural-tree-scene">
      <div className="natural-tree-shadow" aria-hidden="true" />
      <div className="natural-tree-arrival"><img ref={image} className="natural-tree-image" src="/tree-natural.webp" width="1200" height="1200" fetchPriority="high" decoding="async" alt="A photoreal tree with a broad, dense canopy, naturally branching limbs and textured bark." /><CanopyBreeze image={image} active={!paused && visible} /></div>
      <div className="natural-leaf-drift" aria-hidden="true">
        <span className="natural-leaf-cycle drift-one"><span className="natural-loose-leaf" /></span>
        <span className="natural-leaf-cycle drift-two"><span className="natural-loose-leaf" /></span>
        <span className="natural-leaf-cycle drift-three"><span className="natural-loose-leaf" /></span>
      </div>
    </div>
    <figcaption><span>Strong roots. Shared growth.</span><p>A little support makes room for what comes next.</p></figcaption>
    <div className="tree-controls"><button className="tree-control" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? 'Resume tree animation' : 'Pause tree animation'}>{paused ? '▷ Resume' : 'Ⅱ Pause'}</button><button className="tree-control" type="button" onClick={() => { setGeneration(value => value + 1); setPaused(false); }} aria-label="Replay the tree animation">↺ Replay</button></div>
  </figure>;
}
