export function OfficeStandee() {
  return <figure className="about-portrait office-standee">
    <div className="standee-edition"><span>OFFICE EDITION</span><span>01 / Thinking partner</span></div>
    <div className="about-portrait-stage">
      <span className="standee-base" aria-hidden="true" />
      <img src="/rikki-standing-cutout.webp" width="1024" height="1536" loading="lazy" decoding="async" alt="AI-assisted full-length portrait of Rikki G styled as a cardboard office standee, with arms folded, a navy jacket, dark jeans and tan leather shoes." />
      <div className="standee-dimensions" role="img" aria-label="Suggested life-size print: 178 centimetres tall, approximately 58 centimetres wide.">
        <span className="standee-height"><span>178 cm</span></span>
        <span className="standee-width"><span>≈58 cm</span></span>
      </div>
    </div>
    <div className="standee-message"><p>A little perspective.<br /><em>No extra calendar invites.</em></p><span>For your corner of the office. Coffee not included.</span></div>
    <p className="standee-print-note">Suggested life-size print. Width estimated from the artwork.</p>
    <figcaption><span>Rikki G</span><p>AI-assisted portrait study</p></figcaption>
  </figure>;
}
