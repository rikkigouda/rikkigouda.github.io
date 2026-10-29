import { Frame } from '@/components/Frame';
import { AnalyticsPreferencesButton } from '@/components/AnalyticsConsent';
export const metadata = { title: 'Privacy', description: 'Public content only. Optional Google Analytics starts only with consent; local previews stay untracked.', alternates: { canonical: '/privacy/' } };
export default function Privacy() {
  return <Frame current="/privacy/"><article className="article">
    <p className="eyebrow">A small public footprint</p><h1>Privacy is part<br />of the <em>design.</em></h1>
    <p className="article-lead">Read without signing in. Choose whether your visit contributes to analytics.</p>
    <div className="prose">
      <h2>Optional analytics</h2>
      <p>Google Analytics is configured for the published rikki.kiwi site. Its tag is blocked until you choose “Allow analytics”. Declining sends no analytics requests, including consent-mode pings. Local previews and other hostnames never load the tag. Global Privacy Control and Do Not Track signals keep analytics off.</p>
      <p>If you allow it, Google receives page-view and basic visit information, such as a session identifier, browser/device information, approximate location and normal connection information. Advertising features and Google signals are disabled. There are no custom identity fields, user IDs, automatic form or search tracking, or recorded message contents.</p>
      <p>User-level and event-level retention is set to two months, with resets on new activity turned off. Google’s aggregated reports are subject to different retention rules and may remain available longer.</p>
      <p>Only known public page paths and fixed titles are supplied to analytics. Query strings, fragments, unknown paths and referring URLs are excluded. This limits what is sent; it does not make a consented visit anonymous to Google. See <a href="https://policies.google.com/privacy" rel="noreferrer">Google’s privacy policy</a>.</p>
      <h2>Your choice and browser storage</h2>
      <p>On the published site, your allow/decline choice is kept in session storage for this tab. If analytics is allowed, its first-party cookies expire with the browser session. Browser session-restore behaviour can extend a session. No analytics choice or cookies are written by the local preview.</p>
      <p>Use “Analytics choices” in the footer to change your decision. Declining again disables collection and removes this site’s prefixed analytics cookies. Previously collected information is not erased by withdrawing consent.</p>
      <AnalyticsPreferencesButton />
      <h2>What your browser loads</h2>
      <p>Pages, images, fonts and framework scripts are served from the same host. The Google tag is the sole optional third-party script, loaded only after consent on the published domain. There are no remote fonts, social embeds, forms, comments, visitor accounts or mailing lists.</p>
      <p>The Content Security Policy permits exact hashes for generated inline scripts and narrowly allows Google’s tag and analytics endpoints. It continues to block forms, frames, objects and unrestricted inline or evaluated scripts.</p>
      <h2>Public content only</h2>
      <p>The public profile name, profile links and owner-approved portraits are intentional. Private documents, résumé details, phone numbers, email addresses and private biography are excluded. Project and journal stories must not identify companies, people or clients through names or distinctive details. Design studies are labelled and do not claim delivered client engagements.</p>
      <p>The animated tree does not collect or transmit data. The optional cardboard portrait is labelled as AI-assisted, with owner-authorised suggested print dimensions.</p>
      <h2>External links and hosting</h2>
      <p>External links open their respective services when you follow them, with referrer information suppressed. Those services apply their own privacy practices. GitHub Pages receives normal connection information and logs IP addresses for security, independently of your analytics choice. See <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection" rel="noreferrer">the host’s explanation of data collection</a>.</p>
      <h2>A public review version</h2>
      <p>This version is published with the owner’s permission for review. Journal entries retain their editorial draft labels. Analytics stays off on the github.io review address; it is configured only for the intended rikki.kiwi domain.</p>
    </div>
  </article></Frame>;
}
