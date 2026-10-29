'use client';

import { useEffect, useRef, useState } from 'react';
import { createAnalyticsController, type AnalyticsChoice } from '@/lib/analytics';
import { measurementId } from '@/content/analytics';

export function AnalyticsPreferencesButton() {
  return <button className="analytics-preferences" type="button" onClick={() => window.dispatchEvent(new Event('open-analytics-choices'))}>Analytics choices</button>;
}

export function AnalyticsConsent() {
  const controller = useRef<ReturnType<typeof createAnalyticsController> | null>(null);
  const [open, setOpen] = useState(false);
  const [availability, setAvailability] = useState<'production' | 'local' | 'privacy'>('local');
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);

  useEffect(() => {
    controller.current ??= createAnalyticsController(window, measurementId);
    const instance = controller.current;
    const saved = instance.restore();
    setAvailability(instance.availability); setChoice(saved);
    if (instance.availability === 'production' && saved === null) setOpen(true);
    const show = () => setOpen(true);
    window.addEventListener('open-analytics-choices', show);
    return () => window.removeEventListener('open-analytics-choices', show);
  }, []);

  function choose(value: AnalyticsChoice) {
    controller.current?.choose(value); setChoice(value); setOpen(false);
  }

  if (!open) return null;
  return <section className="analytics-choices" aria-labelledby="analytics-heading" role="region">
    <div><h2 id="analytics-heading">Your analytics choice</h2>
      {availability === 'local' ? <p>Analytics is always off in this local preview. No Google tag is loaded and no analytics choice is stored here.</p>
        : availability === 'privacy' ? <p>Your browser’s privacy signal is respected. Google Analytics is off and its tag is not loaded.</p>
          : <><p>Optional Google Analytics helps me understand visits to this site. It starts only if you allow it. Advertising features are off.</p><p className="analytics-detail">Your choice lasts for this tab; analytics cookies last for the browser session. Current choice: {choice === 'granted' ? 'allowed' : choice === 'denied' ? 'declined' : 'not set'}.</p></>}
      <a href="/privacy/">Read the privacy details ↗</a>
    </div>
    <div className="analytics-actions">
      {availability === 'production' && <><button type="button" onClick={() => choose('denied')}>Decline analytics</button><button type="button" onClick={() => choose('granted')}>Allow analytics</button></>}
      <button type="button" onClick={() => setOpen(false)}>Close analytics choices</button>
    </div>
  </section>;
}
