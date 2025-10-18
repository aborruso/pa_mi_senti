import { useMemo } from 'react';
import { buildContextPath } from '../lib/routes';
import { buildTwitterIntentUrl, extractTwitterHandle } from '../lib/social';
import type { ContextEntry, ContactChannel, Municipality } from '../types/pa';
import type { MessageTemplateGroup } from '../types/templates';

interface TemplatePickerProps {
  municipality: Municipality;
  context: ContextEntry;
  channel: ContactChannel;
  templateGroup?: MessageTemplateGroup;
  onNavigate: (path: string) => void;
}

const TemplatePicker = ({
  municipality,
  context,
  channel,
  templateGroup,
  onNavigate
}: TemplatePickerProps) => {
  const handle = useMemo(() => extractTwitterHandle(channel.value), [channel.value]);
  const baseMessage = handle ? `${handle} ` : '';

  const templates = useMemo(() => {
    const definedTemplates = templateGroup?.templates ?? [];
    const customTemplate = {
      id: 'custom',
      label: 'Scrivi un messaggio libero',
      description: 'Apri Twitter con il campo compilato solo con il contatto.',
      message: baseMessage
    };
    return [...definedTemplates, customTemplate];
  }, [templateGroup?.templates, baseMessage]);

  const handleUseTemplate = (message: string) => {
    const finalMessage = message || baseMessage;
    const url = buildTwitterIntentUrl(finalMessage);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener');
    }
  };

  const goBack = () => {
    onNavigate(buildContextPath(municipality.istat, context.slug));
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-brand">Messaggi precompilati</p>
        <h2 className="text-2xl font-semibold text-slate-900">{channel.label}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Scegli uno dei modelli rapidi oppure apri Twitter con un messaggio libero. Potrai sempre
          modificare il testo prima dell&apos;invio.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>
            Comune: <strong className="font-medium text-slate-900">{municipality.name}</strong>
          </span>
          <span>
            Tema: <strong className="font-medium text-slate-900">{context.name}</strong>
          </span>
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="tile flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{template.label}</h3>
              {template.description ? (
                <p className="mt-2 text-sm text-slate-600">{template.description}</p>
              ) : null}
              {template.message ? (
                <blockquote className="mt-4 rounded-lg border border-brand/20 bg-brand/5 p-3 text-sm text-brand-dark">
                  {template.message}
                </blockquote>
              ) : null}
            </div>
            <button
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
              type="button"
              onClick={() => handleUseTemplate(template.message)}
            >
              Usa questo messaggio
              <span aria-hidden="true">↗</span>
            </button>
          </article>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          type="button"
          onClick={goBack}
        >
          ← Torna ai canali
        </button>
        <a
          className="text-sm text-brand underline-offset-2 hover:underline"
          href={channel.value}
          target="_blank"
          rel="noreferrer"
        >
          Apri il profilo su Twitter
        </a>
      </div>
    </section>
  );
};

export default TemplatePicker;
