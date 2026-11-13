export function SourceReferences({ ids }: { ids: string[] }) {
  return <span className="investigation-refs">{ids.map(id => <a key={id} href={`#source-${id}`} aria-label={`Source ${id}`}>[{id}]</a>)}</span>;
}
