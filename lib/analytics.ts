export type AnalyticsChoice = 'granted' | 'denied';
export const consentKey = 'rikki.analytics-consent';
export const pageTitles: Record<string, string> = {
  '/': 'Helping people grow — Rikki G', '/about/': 'About — Rikki G',
  '/work/': 'Portfolio — Rikki G', '/journal/': 'Journal — Rikki G', '/privacy/': 'Privacy — Rikki G',
  '/work/a-smaller-digital-footprint/': 'A smaller digital footprint — Rikki G',
  '/work/a-decision-that-travels/': 'A decision that travels — Rikki G',
  '/work/a-release-with-a-way-back/': 'A release with a way back — Rikki G',
  '/journal/privacy-is-a-design-choice/': 'Privacy is a design choice — Rikki G',
  '/journal/before-the-diagram/': 'Before the diagram, ask a better question — Rikki G',
};

type AnalyticsWindow = Window & {
  dataLayer?: IArguments[];
  gtag?: (...args: unknown[]) => void;
};

export function analyticsAvailability(browser: Window): 'production' | 'local' | 'privacy' {
  if (browser.location.protocol !== 'https:' || !['rikki.kiwi', 'www.rikki.kiwi'].includes(browser.location.hostname)) return 'local';
  const navigator = browser.navigator as Navigator & { globalPrivacyControl?: boolean };
  return navigator.globalPrivacyControl || navigator.doNotTrack === '1' ? 'privacy' : 'production';
}

export function createAnalyticsController(browser: AnalyticsWindow, measurementId: string) {
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) throw new Error('Invalid Analytics measurement ID');
  const availability = analyticsAvailability(browser);
  const disabledKey = `ga-disable-${measurementId}`;
  const flags = browser as unknown as Record<string, unknown>;
  let choice: AnalyticsChoice | null = null;
  let started = false;
  flags[disabledKey] = true;

  function clearCookies() {
    for (const item of browser.document.cookie.split(';')) {
      const name = item.split('=')[0].trim();
      if (/^rikki_ga(?:_|$)/.test(name)) browser.document.cookie = `${name}=; Max-Age=0; Path=/; Secure; SameSite=Lax`;
    }
  }

  function start() {
    if (started || availability !== 'production' || choice !== 'granted') return;
    started = true;
    flags[disabledKey] = false;
    browser.dataLayer ??= [];
    browser.gtag ??= function () { browser.dataLayer!.push(arguments); };
    const tag = browser.gtag;
    tag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    tag('set', 'ads_data_redaction', true);
    tag('set', 'url_passthrough', false);
    tag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    tag('js', new Date());
    const path = Object.hasOwn(pageTitles, browser.location.pathname) ? browser.location.pathname : '/404/';
    tag('config', measurementId, {
      page_location: `https://rikki.kiwi${path}`, page_path: path,
      page_title: pageTitles[path] ?? 'Page not found — Rikki G', page_referrer: '',
      send_page_view: true, allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_prefix: 'rikki', cookie_domain: 'none', cookie_expires: 0,
      cookie_flags: 'SameSite=Lax;Secure',
    });
    if (!browser.document.getElementById('google-analytics-tag')) {
      const script = browser.document.createElement('script');
      script.id = 'google-analytics-tag'; script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.referrerPolicy = 'no-referrer';
      browser.document.head.appendChild(script);
    }
  }

  return {
    availability,
    getChoice: () => choice,
    restore() {
      if (availability !== 'production') return null;
      try {
        const saved = browser.sessionStorage.getItem(consentKey);
        if (saved === 'granted' || saved === 'denied') choice = saved;
      } catch { /* Without storage, ask again rather than assume permission. */ }
      if (choice === 'granted') start();
      else clearCookies();
      return choice;
    },
    choose(value: AnalyticsChoice) {
      if (availability !== 'production') return;
      choice = value;
      try { browser.sessionStorage.setItem(consentKey, value); } catch { /* This page can still honour the choice. */ }
      if (value === 'granted') start();
      else {
        flags[disabledKey] = true;
        started = false;
        if (browser.dataLayer) browser.dataLayer.length = 0;
        clearCookies();
      }
    },
  };
}
