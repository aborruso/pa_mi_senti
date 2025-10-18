import { useState } from 'react';
import type { ContextEntry, Municipality } from '../types/pa';
import { buildTemplatePath } from '../lib/routes';
import { extractTwitterHandle, buildTwitterIntentUrl } from '../lib/social';
import { maybeAppendLocationLink } from '../lib/location';

interface ContextDetailProps {
  municipality: Municipality;
  context: ContextEntry;
  onNavigate: (path: string) => void;
}

const channelColor: Record<string, string> = {
  email: 'bg-emerald-100 text-emerald-800',
  phone: 'bg-indigo-100 text-indigo-800',
  form: 'bg-amber-100 text-amber-800',
  social: 'bg-sky-100 text-sky-800'
};

const ContextDetail = ({ municipality, context, onNavigate }: ContextDetailProps) => (
  <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wide text-brand">Tema</p>
        <h2 className="text-2xl font-semibold text-slate-900">{context.name}</h2>
        <p className="mt-2 text-sm text-slate-600">{context.description}</p>
      </header>
      <ul className="space-y-4">
        {context.channels.map((channel) => (
          <li key={`${context.slug}-${channel.value}`} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${channelColor[channel.type] ?? 'bg-slate-200 text-slate-700'}`}
              >
                {channel.type}
              </span>
              <span className="text-sm font-medium text-slate-900">{channel.label}</span>
            </div>
            {channel.type === 'social' && channel.platform === 'twitter' ? (
              <TwitterChannelActions
                municipality={municipality}
                contextSlug={context.slug}
                channelKey={channel.key}
                profileUrl={channel.value}
                onNavigate={onNavigate}
              />
            ) : (
              <ChannelLink channelType={channel.type} value={channel.value} />
            )}
            {channel.notes ? (
              <p className="mt-2 text-xs text-slate-500">Nota: {channel.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </article>
    <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Comune</p>
        <p className="text-lg font-semibold text-slate-900">{municipality.name}</p>
        <p className="text-xs text-slate-500">ISTAT {municipality.istat}</p>
      </div>
      {context.responseTime ? (
        <div className="rounded-lg bg-brand/10 p-3 text-sm text-brand-dark">
          Tempo medio risposta: {context.responseTime}
        </div>
      ) : null}
      {municipality.helpfulLinks?.length ? (
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Link utili</p>
          <ul className="mt-2 space-y-2 text-sm text-brand-dark">
            {municipality.helpfulLinks.map((link) => (
              <li key={link.url}>
                <a className="hover:underline" href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  </section>
);

export default ContextDetail;

const ChannelLink = ({ channelType, value }: { channelType: string; value: string }) => (
  <p className="mt-2 break-all text-sm text-brand-dark">
    {channelType === 'email' ? (
      <a className="hover:underline" href={`mailto:${value}`}>
        {value}
      </a>
    ) : channelType === 'phone' ? (
      <a className="hover:underline" href={`tel:${value.replace(/\s+/g, '')}`}>
        {value}
      </a>
    ) : (
      <a className="hover:underline" href={value} target="_blank" rel="noreferrer">
        {value}
      </a>
    )}
  </p>
);

interface TwitterChannelActionsProps {
  municipality: Municipality;
  contextSlug: string;
  channelKey?: string;
  profileUrl: string;
  onNavigate: (path: string) => void;
}

const TwitterChannelActions = ({
  municipality,
  contextSlug,
  channelKey,
  profileUrl,
  onNavigate
}: TwitterChannelActionsProps) => {
  const handle = extractTwitterHandle(profileUrl);
  const baseMessage = handle ? `${handle} ` : '';
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const handleTemplateNavigation = async () => {
    if (channelKey) {
      onNavigate(buildTemplatePath(municipality.istat, contextSlug, channelKey));
      return;
    }
    if (typeof window !== 'undefined') {
      const finalMessage = await maybeAppendLocationLink(baseMessage, {
        onRequestStart: () => setIsRequestingLocation(true),
        onRequestEnd: () => setIsRequestingLocation(false)
      });
      window.open(buildTwitterIntentUrl(finalMessage), '_blank', 'noopener');
    }
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-brand-dark">
      {handle ? <span>{handle}</span> : null}
      <button
        className="inline-flex items-center rounded-md bg-brand px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand/60"
        onClick={handleTemplateNavigation}
        type="button"
        disabled={isRequestingLocation}
      >
        {isRequestingLocation ? 'Recupero posizione…' : 'Scrivigli'}
      </button>
      <a
        className="text-xs font-medium text-brand underline-offset-2 hover:underline"
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
      >
        Apri profilo
      </a>
    </div>
  );
};
