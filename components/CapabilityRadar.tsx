import { experience } from '@/content/capabilities';
const { capabilities, scaleMaximum } = experience;

function point(index: number, radius: number) {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / capabilities.length;
  return { x: 160 + Math.cos(angle) * radius, y: 150 + Math.sin(angle) * radius };
}

function ring(radius: number) {
  return capabilities.map((_, index) => { const p = point(index, radius); return `${p.x},${p.y}`; }).join(' ');
}

export function CapabilityRadar() {
  const values = capabilities.map((capability, index) => {
    const p = point(index, 78 * Math.min(capability.years, scaleMaximum) / scaleMaximum);
    return `${p.x},${p.y}`;
  }).join(' ');
  return <figure className="capability-radar">
    <figcaption className="radar-caption">Experience in years</figcaption>
    <svg viewBox="0 0 320 285" role="img" aria-labelledby="capability-title capability-description">
      <title id="capability-title">Estimated years of experience by discipline</title>
      <desc id="capability-description">{capabilities.map(item => `${item.label}: ${item.display}`).join('; ')}. Rounded résumé-based estimates of time in roles involving each discipline, not full-time allocations or proficiency ratings. Years overlap. The common scale runs from zero to twenty or more years.</desc>
      {[5, 10, 15, 20].map(years => <polygon key={years} className="radar-grid" points={ring(78 * years / scaleMaximum)} />)}
      {capabilities.map((capability, index) => {
        const p = point(index, 78);
        return <g key={capability.label}>
          <line className="radar-spoke" x1="160" y1="150" x2={p.x} y2={p.y} />
          <text className="radar-label" x={capability.x} y={capability.y} textAnchor="middle">{capability.lines.map((line, lineIndex) => <tspan key={line} x={capability.x} dy={lineIndex === 0 ? 0 : 13}>{line}</tspan>)}<tspan className="radar-value" x={capability.x} dy="16">{capability.display}</tspan></text>
        </g>;
      })}
      <polygon className="radar-experience" points={values} />
      {capabilities.map((capability, index) => { const p = point(index, 78 * Math.min(capability.years, scaleMaximum) / scaleMaximum); return <circle key={capability.label} className="radar-point" cx={p.x} cy={p.y} r="3" />; })}
      {[5, 10, 15, 20].map(years => <text key={years} className="radar-scale" x="169" y={153 - 78 * years / scaleMaximum}>{years}</text>)}
    </svg>
    <p className="radar-note">Approximate experience · years overlap</p>
    <details className="radar-method"><summary>How to read this</summary><p>Rounded estimates from my résumé, counting documented responsibilities as well as job titles. Overlapping periods within each discipline are counted once, using month-level dates where available. Year-only periods remain approximate.</p><p>These are years in roles involving a discipline, not full-time allocations or skill ratings. Different disciplines overlap and should not be added together. The scale runs from 0 to 20+ years.</p><p>Only aggregate figures are included here. Employer names, role dates, project details and the source document remain private.</p></details>
  </figure>;
}
