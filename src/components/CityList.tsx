import { buildCityPath } from '../lib/routes';
import type { Municipality } from '../types/pa';

interface CityListProps {
  municipalities: Municipality[];
  onNavigate: (path: string) => void;
}

const CityList = ({ municipalities, onNavigate }: CityListProps) => {
  if (!municipalities.length) {
    return (
      <p className="text-sm text-slate-500">
        Non ci sono città configurate. Aggiungi voci in `public/data/pa.yml`.
      </p>
    );
  }
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {municipalities.map((municipality) => (
        <article key={municipality.istat} className="tile">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">{municipality.name}</h2>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {municipality.region} · ISTAT {municipality.istat}
            </p>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            {municipality.contexts.length} temi gestiti · Aggiorna i contatti nel registro YAML.
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
            onClick={() => onNavigate(buildCityPath(municipality.istat))}
          >
            Scegli città
            <span aria-hidden="true">→</span>
          </button>
        </article>
      ))}
    </section>
  );
};

export default CityList;
