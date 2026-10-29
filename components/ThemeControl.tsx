'use client';

import { useEffect, useState } from 'react';

type Theme = 'auto' | 'light' | 'dark';

export function ThemeControl() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const value = new URL(window.location.href).searchParams.get('theme');
    setTheme(value === 'light' || value === 'dark' ? value : 'auto');
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
    // Carry this presentation choice between static pages without storing data.
    const update = (url: URL) => {
      if (theme === 'auto') url.searchParams.delete('theme');
      else url.searchParams.set('theme', theme);
      return url;
    };
    window.history.replaceState(null, '', update(new URL(window.location.href)));
    document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
      const url = new URL(link.href);
      if (url.origin === window.location.origin) link.href = update(url).href;
    });
  }, [theme]);

  return <div className="theme-control" role="group" aria-label="Colour theme">
    {(['auto', 'light', 'dark'] as const).map(value => {
      const label = value === 'auto' ? 'System theme' : value === 'light' ? 'Light theme' : 'Dark theme';
      return <button key={value} type="button" aria-label={label} title={label} aria-pressed={(theme ?? 'auto') === value} onClick={() => setTheme(value)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {value === 'auto' ? <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></> : value === 'light' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.8 13.3A9 9 0 0 1 10.7 3.2a9 9 0 1 0 10.1 10.1Z" />}
        </svg>
      </button>;
    })}
  </div>;
}
