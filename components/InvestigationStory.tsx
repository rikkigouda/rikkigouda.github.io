import data from '@/content/nvidia-investigation.json';
import { InvestigationTimeline } from './InvestigationTools';
import { FlowExplorer } from './FlowExplorer';
const notebook = `/journal/${data.article.slug}/notebook/`;
const numbers = Object.fromEntries(data.sources.map((s, i) => [s.id, i + 1]));

export function CondensedTimeline() {
  const events = data.condensedTimelineIds.map(id => data.timeline.find(event => event.id === id)!);
  return <div className="story-visual"><InvestigationTimeline events={events} title="Explore ten events that frame the story" sourcePath={notebook} embedded /><a href={`${notebook}#timeline`} target="_blank" rel="noreferrer">All chronology records in the evidence appendix (new tab)</a></div>;
}
export function SourcedFlowDiagram({ type }: { type: 'financial' }) {
  return <FlowExplorer edges={data.financialDiagram} sourcePath={notebook} numbers={numbers} type={type} />;
}
