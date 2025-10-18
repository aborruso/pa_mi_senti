import { useMemo, useState } from "react";
import { buildTwitterIntentUrl, extractTwitterHandle } from "../../lib/social";
import { maybeAppendLocationLink } from "../../lib/location";
import type { MessageTemplateItem } from "../../lib/types";

interface TemplatePickerProps {
  municipalityName: string;
  contextName: string;
  channelLabel: string;
  channelValue: string;
  templates: MessageTemplateItem[];
  backUrl: string;
}

const TemplatePicker = ({
  municipalityName,
  contextName,
  channelLabel,
  channelValue,
  templates,
  backUrl
}: TemplatePickerProps) => {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const handle = useMemo(() => extractTwitterHandle(channelValue), [channelValue]);
  const baseMessage = handle ? `${handle} ` : "";

  const availableTemplates = useMemo(() => {
    const defined = templates ?? [];
    const custom: MessageTemplateItem = {
      id: "custom",
      label: "Scrivi un messaggio libero",
      description: "Apri Twitter con il destinatario già compilato e completa il testo.",
      message: baseMessage
    };
    return [...defined, custom];
  }, [templates, baseMessage]);

  const handleUseTemplate = async (template: MessageTemplateItem) => {
    if (typeof window === "undefined") {
      return;
    }

    const popup = window.open("about:blank", "_blank", "noopener");
    let finalMessage = template.message || baseMessage;

    finalMessage = await maybeAppendLocationLink(finalMessage, {
      onRequestStart: () => setActiveTemplate(template.id),
      onRequestEnd: () => setActiveTemplate(null)
    });

    setActiveTemplate(null);

    const url = buildTwitterIntentUrl(finalMessage);
    if (popup) {
      popup.location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-brand">Messaggi precompilati</p>
        <h2 className="text-2xl font-semibold text-slate-900">{channelLabel}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Scegli uno dei modelli rapidi oppure apri Twitter con un messaggio libero. Potrai sempre
          modificare il testo prima dell&apos;invio.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>
            Comune: <strong className="font-medium text-slate-900">{municipalityName}</strong>
          </span>
          <span>
            Tema: <strong className="font-medium text-slate-900">{contextName}</strong>
          </span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {availableTemplates.map((template) => (
          <article
            key={template.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
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
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand/60"
              type="button"
              onClick={() => handleUseTemplate(template)}
              disabled={activeTemplate === template.id}
            >
              {activeTemplate === template.id ? "Recupero posizione…" : "Usa questo messaggio"}
              <span aria-hidden="true">↗</span>
            </button>
          </article>
        ))}
      </div>

      <div className="flex justify-between">
        <a
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          href={backUrl}
        >
          ← Torna ai canali
        </a>
        <a
          className="text-sm text-brand underline-offset-2 hover:underline"
          href={channelValue}
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
