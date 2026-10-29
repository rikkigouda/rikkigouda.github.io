# Rikki G — personal portfolio (public review)

Next.js App Router, TypeScript and a static export for the existing `main:/docs` GitHub Pages configuration. Home introduces the personal brand and selected work; Portfolio, About, Journal, Privacy, project detail pages and journal articles have separate routes. Portrait-inspired blues and an editorial style are preserved. FOSCA is an initial design reference only.

## Develop and verify

Requires Node.js 20.9+ and npm.

```sh
npm ci
npm run dev
npm run build
npm test
npm run typecheck
npm run preview
```

Development runs on loopback port 3000. Preview serves the actual export on http://127.0.0.1:4173. `next start` is not used for a static export. The production preview represents the final privacy policy; the development server requires development resources and is not deployment output. Framework build telemetry is disabled by the supplied build/dev scripts.

`app/` defines pages and shared styling, `components/` holds presentation components, `content/projects.ts` holds portfolio entries and `content/posts.json` holds original editorial drafts. Server Components render at build time. Navigation uses ordinary anchors, without route prefetching. Client components animate the tree using transient state only; they do not collect, transmit or persist data. There are no server APIs.

The build exports to `out/`, then recreates `docs/` and inserts a restrictive Content Security Policy. Each build-generated inline script gets its own SHA-256 allowance; no unrestricted inline-script allowance is used. Assets remain same-origin except the optional Google tag. CSP permits only its required Analytics origins, blocks forms and frames, and retains exact inline hashes without unsafe-inline or unsafe-eval. Referrers are suppressed. `npm test` verifies actual exported pages, links, assets, metadata, exact script hashes and privacy invariants. Earlier prototype files and legacy React sources have been retired.

## Content and privacy

The current palette follows the original portrait: navy backgrounds and soft blue accents in dark mode; cool near-white surfaces, navy text and deeper blue accents in light mode. Shared tokens cover navigation, headings, controls, portfolio artwork, journal and reading text. The photograph and natural tree colours are unchanged.

The main About view uses the unchanged original LinkedIn portrait, served locally as public/rikki-portrait.webp with metadata stripped. The executive copy leads with clear decisions and capable teams, explains technical direction, shared ownership and responsible delivery, and links to existing, expressly labelled design studies. It introduces no fabricated client stories, employment details, business metrics or delivery claims. The home introduction uses the same positioning while retaining “Helping people grow.”

The cardboard concept is retained inside a native “A lighter side” disclosure, closed by default and usable without JavaScript. Its image is lazy-loaded. The optional standee keeps its paper rim, cardboard depth, base, message and owner-authorised suggested print dimensions (178 cm tall and approximately 58 cm wide, estimated from the artwork). It remains labelled an AI-assisted portrait study, not a manufacturing template or a verified body-width measurement.

The optional public/rikki-standing-cutout.webp uses a transparency mask and two local hand-anatomy patches from the built-in image tool. Opaque subject pixels outside those patches, including the face, were verified unchanged. The previous standing image remains as public/rikki-standing.webp. The original portrait was converted losslessly with decoded pixels verified identical to its source. All portrait assets have EXIF, XMP, IPTC and ICC metadata removed. No source URLs, account data or private documents are embedded. The owner authorised a public review deployment on 29 October 2026.

The top navigation stays visible while scrolling, with an opaque themed background and a compact layout. Anchor scrolling clears the sticky header and the skip link stays above it. Navigation text is 14px, editorial labels are 12px, captions and actions are 13–14px, and portfolio summaries are 15px; miniature artwork remains decorative. No scroll listener or animation is needed for the header.

The shared top navigation places the brand alongside page links and icon buttons for System (monitor), Light (sun) and Dark (moon), with accessible names, tooltips and pressed states. The current page has a filled tab and a small green marker. On mobile the page links move to their own row, keeping every destination visible. This replaces the fixed left sidebar on every page, including the 404. System follows the browser's colour preference. Manual choices travel through a `theme` URL parameter so static-page navigation and reloads retain them without cookies or browser storage. Returning to System removes that parameter. Both palettes cover reading text, portfolio artwork, controls and the transparent tree. Decorative falling leaves and fresh growth use slightly larger, textured shapes with staggered timing, and respect reduced motion.

- No résumé contents or original files, private biography, phone numbers, email addresses or identifying client details. The owner authorised one exception: aggregate estimated years per capability in `content/capabilities.ts`. No underlying role dates, employer names, private chronology or source documents are stored.
- Only the existing public profile identity and public profile links are used.
- Project and journal stories exclude company names, people names, internal project names, distinctive dates and sensitive figures.
- The portfolio includes this site as built work under local review and two expressly labelled general design studies. Studies do not claim completed client engagements or measured business outcomes.
- Journal entries remain editorial drafts until approved.
- Google Analytics is the owner-authorised exception: opt-in only on the HTTPS production domain, with session-only choice storage and prefixed Analytics cookies. No other tracking, fingerprinting, forms, visitor accounts, comments, remote fonts or third-party embeds.
- Static hosting still receives normal connection information; the privacy page explains the hosting boundary.

“Helping people grow” is the homepage headline and central brand statement. The hero uses a photoreal generated tree with a full canopy, detailed foliage and natural bark, replacing the SVG sketch. The image was created with the built-in image-generation tool and converted to a 1200px transparent WebP at public/tree-natural.webp. It depicts no real person, place or engagement. The asset is served locally; there is no runtime image-generation or third-party image service. A WebGL mesh deforms separate canopy regions at different speeds, with finer foliage flutter and occasional stronger breezes; the trunk and roots stay fixed. This is local deformation of one photograph, rather than a simulation of individual leaves. Rendering is capped at 30fps and stops while offscreen, backgrounded or under reduced-motion preferences. CSS adds a fade-in and three staggered leaf cycles: a small leaf detaches and drifts downward, then a replacement gradually unfurls nearby. Different cycle lengths keep the canopy renewal sparse. Offscreen stopping and reduced motion also cover these decorative leaves. Pause/replay buttons have been removed at the owner request. Reduced motion or unavailable WebGL retains the still accessible image. There are no network requests, storage, canvas readbacks or renderer-identification queries. The former radar component and its authorised aggregate estimates remain unused; no private chronology or source résumé is stored.

## Google Analytics — configured for the intended custom domain

GA4 property rikki.kiwi (560916764), web stream 16212130607, measurement ID G-3MEPEV9PFK were created and verified through the Edge browser extension. The property uses New Zealand reporting time and NZD. Enhanced measurement is off. User and event retention are both set to two months with activity resets disabled; this does not limit aggregated-report retention. This is separate from the pre-existing project property; no hosting or DNS settings changed.

The root AnalyticsConsent component applies to every route, including 404. Google’s tag is not loaded and no consent-mode pings are sent until explicit opt-in. Analytics runs only on HTTPS rikki.kiwi or www.rikki.kiwi, and stays disabled on loopback, other hosts and under GPC/DNT. Footer Analytics choices controls allow withdrawal. The binary choice is saved only in sessionStorage for the tab; the tag uses host-only, prefixed session cookies. Withdrawal disables collection, clears queued commands and removes those cookies. Browser session restore can extend a session, and withdrawal does not delete prior server-side data.

Only allowlisted public paths and fixed titles are supplied; unknown paths become /404/. Query strings, fragments and referring URLs are excluded. Google signals and advertising personalisation are disabled. There are no custom identity fields or interaction capture. Consented requests still expose normal connection/device information to Google; this is not an anonymity guarantee. Analytics stays off on the github.io review address. Production data receipt remains unverified until the custom domain is active and a visitor opts in.

Validation: npm test covers export/CSP invariants plus controller tests for consent, denial, withdrawal, duplicate loading, cross-page choice restoration, path sanitisation, privacy signals, blocked storage and local-host suppression. Controller tests compile TypeScript in memory with the existing TypeScript dependency; no real Google requests are made by tests.

References: https://developers.google.com/tag-platform/security/concepts/consent-mode ; https://developers.google.com/tag-platform/security/guides/csp ; https://developers.google.com/analytics/devguides/collection/ga4/reference/config

## Publication gate

Do not push, open a public pull request, merge or deploy without the owner's explicit confirmation. Merging the generated `docs/` into `main` would publish through the existing GitHub Pages configuration. The owner authorised publishing the current review version on 29 October 2026.

## Custom domain — prepared, not activated

The owner registered `rikki.kiwi` through GoDaddy. Metadata and route-specific canonical URLs use `https://rikki.kiwi`; `public/CNAME` is exported into `docs/CNAME`. No live DNS or hosting settings have been changed.

After explicit launch approval, verify domain ownership in the GitHub account and add `rikki.kiwi` to the repository's Pages custom-domain setting before changing DNS. Review existing records before editing; preserve unrelated services. GitHub's current documented DNS configuration is:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | rikkigouda.github.io |

Then verify DNS and HTTPS and enable HTTPS enforcement when available. `rikki.kiwi` is the intended primary domain. Follow [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) at launch; registration alone does not activate hosting.

## Current review deployment

The owner authorised publication on 29 October 2026. The review URL is https://rikkigouda.github.io/ using the existing main:/docs Pages source. content/site.json controls the canonical origin, custom domain and review indexing preference. Its customDomain is null, so the build omits docs/CNAME and does not redirect to the parked rikki.kiwi domain. The review asks search engines not to index it; it remains publicly accessible. DNS is unchanged and analytics remains disabled on github.io. Journal labels remain Editorial draft. To activate the custom domain later, configure and verify DNS/HTTPS, update content/site.json, then build and verify again.
