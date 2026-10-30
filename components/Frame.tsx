import type { ReactNode } from 'react';
import { ThemeControl } from './ThemeControl';
import { AnalyticsPreferencesButton } from './AnalyticsConsent';
const navigation = [['/', 'Home'], ['/about/', 'About'], ['/perspectives/', 'Perspectives'], ['/work/', 'Work'], ['/journal/', 'Journal']] as const;
export function Frame({ current, children }: { current: string; children: ReactNode }) {
  return <><a className="skip" href="#main">Skip to content</a><header className="site-header"><div className="site-header-inner">
    <a className="site-identity" href="/" aria-label="Rikki G home">Rikki G<span>People. Decisions. Growth.</span></a>
    <nav aria-label="Main navigation">{navigation.map(([href, label]) => <a href={href} key={href} aria-current={current === href ? 'page' : undefined}>{label}</a>)}</nav>
    <ThemeControl /></div></header>
    <main id="main" tabIndex={-1} className="home-main site-main">{children}<footer className="footer"><div><p>© {new Date().getFullYear()} Rikki G</p></div><div><AnalyticsPreferencesButton /><a href="/privacy/">Privacy</a><a href="https://www.linkedin.com/in/rikkigouda/" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/rikkigouda" rel="noreferrer">GitHub ↗</a></div></footer></main></>;
}
