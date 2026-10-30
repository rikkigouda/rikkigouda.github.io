import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AnalyticsConsent } from '@/components/AnalyticsConsent';
import site from '@/content/site.json';
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  robots: site.review ? { index: false, follow: false } : undefined,
  title: { default: 'Rikki G | Helping people grow', template: '%s | Rikki G' },
  description: 'A personal space for fatherhood, engineering, markets, learning and the questions behind a good decision.',
  referrer: 'no-referrer', icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f3f6fa' }, { media: '(prefers-color-scheme: dark)', color: '#102238' }] };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en-NZ"><body>{children}<AnalyticsConsent /></body></html>; }
