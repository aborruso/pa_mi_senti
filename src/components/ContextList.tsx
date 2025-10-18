import { buildContextPath } from '../lib/routes';
import type { ContextEntry, Municipality } from '../types/pa';

interface ContextListProps {
  municipality: Municipality;
  onNavigate: (path: string) => void;
}

const ContextTile = ({
  municipality,
  context,
  onNavigate
}: {
  municipality: Municipality;
  context: ContextEntry;
  onNavigate: (path: string) => void;
}) => (
  <article className="tile">
    <h3 className="text-lg font-semibold text-slate-900">{context.name}</h3>
    <p className="mb-4 text-sm text-slate-600">{context.description}</p>
    <div className="flex flex-wrap gap-2">
      {context.channels.map((channel) => (
        <span
          key={`${context.slug}-${channel.value}`}
          className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-dark"
        >
          {channel.type}
        </span>
      ))}
    </div>
    <button
      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand transition hover:bg-brand hover:text-white"
      onClick={() => onNavigate(buildContextPath(municipality.istat, context.slug))}
    >
      Vedi contatti
      <span aria-hidden="true">→</span>
    </button>
  </article>
);

const ContextList = ({ municipality, onNavigate }: ContextListProps) => (
  <section>
    <header className="mb-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Seleziona il tema per {municipality.name}
      </h2>
      <p className="text-sm text-slate-600">
        Ogni tema offre i canali consigliati per velocizzare la tua richiesta.
      </p>
    </header>
    <div className="grid gap-4 sm:grid-cols-2">
      {municipality.contexts.map((context) => (
        <ContextTile
          key={context.slug}
          municipality={municipality}
          context={context}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  </section>
);

export default ContextList;
