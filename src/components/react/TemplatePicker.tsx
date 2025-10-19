import { useMemo, useState, useEffect, useRef } from "react";
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
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<MessageTemplateItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  
  const handle = useMemo(() => extractTwitterHandle(channelValue), [channelValue]);
  const baseMessage = handle ? `${handle} ` : "";

  const availableTemplates = useMemo(() => {
    const defined = templates ?? [];
    const custom: MessageTemplateItem = {
      id: "custom",
      label: "Scrivi un messaggio libero",
      description: "Apri Twitter/X con il destinatario già compilato e completa il testo.",
      message: baseMessage
    };
    return [...defined, custom];
  }, [templates, baseMessage]);

  // Focus trap and ESC key handling for modal dialog
  useEffect(() => {
    if (!showLocationDialog) return;

    // Focus the first button when dialog opens
    yesButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoadingLocation) {
        setShowLocationDialog(false);
        setPendingTemplate(null);
      }

      // Trap focus within dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showLocationDialog, isLoadingLocation]);

  const handleUseTemplate = async (template: MessageTemplateItem) => {
    if (typeof window === "undefined") {
      return;
    }

    setPendingTemplate(template);
    setShowLocationDialog(true);
  };

  const proceedWithMessage = async (includeLocation: boolean) => {
    if (!pendingTemplate) {
      return;
    }

    let initialMessage = pendingTemplate.message || baseMessage;

    // Aggiungi l'hashtag #PaMiSenti solo se non è il template custom (messaggio libero)
    if (pendingTemplate.id !== "custom" && initialMessage.trim()) {
      initialMessage = `${initialMessage.trim()} #PaMiSenti`;
    }

    setActiveTemplate(pendingTemplate.id);
    let finalMessage = initialMessage;

    try {
      if (includeLocation) {
        setIsLoadingLocation(true);
        finalMessage = await maybeAppendLocationLink(initialMessage, {
          confirmMessage: "", // Non mostrare il confirm, abbiamo già chiesto
          onRequestStart: () => setActiveTemplate(pendingTemplate.id),
          onRequestEnd: () => setActiveTemplate(null)
        });
      }
    } catch (error) {
      console.error("Errore durante il recupero della posizione:", error);
    } finally {
      setIsLoadingLocation(false);
      setShowLocationDialog(false);
      setActiveTemplate(null);
      setPendingTemplate(null);
    }

    const finalUrl = buildTwitterIntentUrl(finalMessage);
    window.open(finalUrl, "_blank", "noopener");
  };

  return (
    <>
      <section className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-brand">Messaggi precompilati</p>
          <h2 className="text-2xl font-semibold text-slate-900">{channelLabel}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Scegli uno dei modelli rapidi oppure apri Twitter/X con un messaggio libero. Potrai sempre
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

        <div className="grid gap-4 lg:grid-cols-2" role="list" aria-label="Template messaggi disponibili">
          {availableTemplates.map((template) => (
            <article
              key={template.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              role="listitem"
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
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:bg-brand/60"
                type="button"
                onClick={() => handleUseTemplate(template)}
                disabled={activeTemplate === template.id}
                aria-busy={activeTemplate === template.id}
                aria-label={`Usa il messaggio: ${template.label}`}
              >
                {activeTemplate === template.id ? "Recupero posizione…" : "Usa questo messaggio"}
                <span aria-hidden="true">↗</span>
              </button>
            </article>
          ))}
        </div>

        <div className="flex justify-between">
          <a
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50"
            href={backUrl}
            aria-label="Torna alla lista dei canali"
          >
            <span aria-hidden="true">←</span> Torna ai canali
          </a>
          <a
            className="text-sm text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:rounded"
            href={channelValue}
            target="_blank"
            rel="noreferrer"
            aria-label="Apri il profilo su Twitter/X (si apre in una nuova scheda)"
          >
            Apri il profilo su Twitter/X
          </a>
        </div>
      </section>

      {/* Dialogo accessibile per la geolocalizzazione */}
      {showLocationDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-dialog-title"
          onClick={() => {
            if (!isLoadingLocation) {
              setShowLocationDialog(false);
              setPendingTemplate(null);
            }
          }}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoadingLocation ? (
              <>
                <div className="flex items-center gap-3">
                  <div 
                    className="h-6 w-6 animate-spin rounded-full border-4 border-brand border-t-transparent"
                    role="status"
                    aria-label="Caricamento in corso"
                  ></div>
                  <h3 id="location-dialog-title" className="text-lg font-semibold text-slate-900">
                    Recupero posizione...
                  </h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Attendi mentre recuperiamo le coordinate GPS. Potrebbero essere necessari alcuni secondi.
                </p>
              </>
            ) : (
              <>
                <h3 id="location-dialog-title" className="text-lg font-semibold text-slate-900">
                  Vuoi aggiungere un link con la tua posizione?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Puoi includere un link con la tua posizione attuale nel messaggio per facilitare
                  l&apos;intervento della PA.
                </p>
                <p className="mt-2 text-xs text-slate-500 italic">
                  La precisione dipende dal tuo dispositivo.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    ref={yesButtonRef}
                    className="flex-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50"
                    type="button"
                    onClick={() => proceedWithMessage(true)}
                  >
                    Sì, aggiungi posizione
                  </button>
                  <button
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
                    type="button"
                    onClick={() => proceedWithMessage(false)}
                  >
                    No, grazie
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TemplatePicker;
