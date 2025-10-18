import { buildCityPath, buildContextPath } from '../lib/routes';
import type { Municipality } from '../types/pa';

interface BreadcrumbsProps {
  municipality?: Municipality;
  contextSlug?: string;
  contextName?: string;
  channelLabel?: string;
  onNavigate: (path: string) => void;
}

const Breadcrumbs = ({
  municipality,
  contextSlug,
  contextName,
  channelLabel,
  onNavigate
}: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
    <ol className="flex items-center gap-2">
      <li>
        <button className="hover:text-brand" onClick={() => onNavigate('/')}>
          Città
        </button>
      </li>
      {municipality ? (
        <>
          <li aria-hidden="true">/</li>
          <li>
            <button
              className="hover:text-brand"
              onClick={() => onNavigate(buildCityPath(municipality.istat))}
            >
              {municipality.name}
            </button>
          </li>
        </>
      ) : null}
      {municipality && contextSlug ? (
        <>
          <li aria-hidden="true">/</li>
          <li>
            {channelLabel ? (
              <button
                className="hover:text-brand"
                onClick={() => onNavigate(buildContextPath(municipality.istat, contextSlug))}
              >
                {contextName ?? contextSlug.replace(/_/g, ' ')}
              </button>
            ) : (
              <span className="font-medium text-brand-dark">
                {contextName ?? contextSlug.replace(/_/g, ' ')}
              </span>
            )}
          </li>
        </>
      ) : null}
      {channelLabel ? (
        <>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-brand-dark">{channelLabel}</li>
        </>
      ) : null}
    </ol>
  </nav>
);

export default Breadcrumbs;
