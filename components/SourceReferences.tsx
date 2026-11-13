export function SourceReferences({ ids, basePath = '', newTab = false, numbers }: { ids: string[]; basePath?: string; newTab?: boolean; numbers?: Record<string, number> }) {
  return <span className="investigation-refs">{ids.map(id => <a key={id} href={`${basePath}#source-${id}`} target={newTab ? '_blank' : undefined} rel={newTab ? 'noreferrer' : undefined} aria-label={`Source ${numbers?.[id] ?? id}${newTab ? ', Investigation Notebook, opens in a new tab' : ''}`}>[{numbers?.[id] ?? id}]</a>)}</span>;
}
