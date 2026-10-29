// Owner-authorised aggregates only. Never add source documents, employer names,
// role dates or the underlying private chronology here.
// These are rounded estimates of time in roles involving a discipline, not
// full-time allocations. Disciplines overlap and must not be added together.
// Include documented responsibilities regardless of job title. Use dated role
// intervals, merge overlapping months within each discipline, then round years.
// Year-only periods remain approximate. Do not infer uninterrupted experience.
export const experience = {
  scaleMaximum: 20,
  capabilities: [
    { label: 'Software engineering', lines: ['Software', 'engineering'], years: 20, display: '20+ yrs', x: 160, y: 26 },
    { label: 'Architecture', lines: ['Architecture'], years: 14, display: '≈14 yrs', x: 266, y: 115 },
    { label: 'Cloud platforms', lines: ['Cloud', 'platforms'], years: 10, display: '≈10 yrs', x: 224, y: 239 },
    { label: 'Integration', lines: ['Integration'], years: 10, display: '≈10 yrs', x: 96, y: 246 },
    { label: 'Technical leadership', lines: ['Technical', 'leadership'], years: 15, display: '≈15 yrs', x: 51, y: 111 },
  ],
};
