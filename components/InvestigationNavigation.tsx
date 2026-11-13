'use client';
import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const update = () => {
      const reading = document.getElementById('article-reading');
      if (!reading) return;
      const bounds = reading.getBoundingClientRect();
      setValue(Math.round(Math.max(0, Math.min(100, -bounds.top / Math.max(1, bounds.height - window.innerHeight) * 100))));
    };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className="reading-progress"><progress max={100} value={value} aria-label="Article reading progress" /></div>;
}
export function NotebookEntryLink({ path, anchors }: { path: string; anchors: string[] }) {
  const [hash, setHash] = useState('');
  useEffect(() => {
    const update = () => setHash(anchors.includes(window.location.hash.slice(1)) ? window.location.hash : '');
    update(); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update);
  }, [anchors]);
  return <a href={`${path}${hash}`} target="_blank" rel="noreferrer">Open the matching notebook entry (new tab)</a>;
}
export function NotebookAnchors() {
  useEffect(() => {
    const open = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const element = document.getElementById(id);
      if (element instanceof HTMLDetailsElement) element.open = true;
      element?.scrollIntoView({ block: 'start' });
    };
    open(); window.addEventListener('hashchange', open); return () => window.removeEventListener('hashchange', open);
  }, []);
  return null;
}
