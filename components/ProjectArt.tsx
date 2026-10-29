export function ProjectArt({ kind }: { kind: 'site' | 'decision' | 'release' }) {
  return <div className={`project-art art-${kind}`} aria-hidden="true">{kind === 'site'
    ? <div className="mini-browser"><div className="mini-browser-top"><i /><i /><i /></div><div className="mini-browser-body"><span className="mini-sidebar" /><div><b>Less to collect.<br /><em>More to say.</em></b><span className="mini-rule" /><span className="mini-rule short" /><div className="mini-panels"><span /><span /></div></div></div></div>
    : kind === 'decision' ? <div className="decision-sheet"><span>DECISION / 001</span><b>Make the<br /><em>why</em> visible.</b><div><span>Context</span><span>Options</span><span>Trade-offs</span></div></div>
    : <div className="release-sketch"><span>Prepare</span><i>↓</i><span>Verify</span><i>↓</i><span>Release <b>↶</b></span><small>Always a way back.</small></div>}</div>;
}
