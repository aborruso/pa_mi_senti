import { useMemo, useState, useEffect, useRef, lazy, Suspense } from "react";
import { buildTwitterIntentUrl, extractTwitterHandle } from "../../lib/social";
import { requestCurrentPosition, appendLocationLinkFromCoords } from "../../lib/location";
import type { Coordinates } from "../../lib/location";
import type { MessageTemplateItem, ChannelType } from "../../lib/types";

// Lazy load map component
const MapPickerModal = lazy(() => import("./MapPickerModal"));

interface TemplatePickerProps {
  municipalityName: string;
  contextName: string;
  channelLabel: string;
  channelValue: string;
  channelType: ChannelType;
  templates: MessageTemplateItem[];
  backUrl: string;
}

const TemplatePicker = ({
  municipalityName,
  contextName,
  channelLabel,
  channelValue,
  channelType,
  templates,
  backUrl
}: TemplatePickerProps) => {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<MessageTemplateItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const gpsButtonRef = useRef<HTMLButtonElement>(null);

  const isSocialChannel = channelType === "social";
  const isEmailChannel = channelType === "email";

  const buildMailtoUrl = (template: MessageTemplateItem, messageOverride?: string): string => {
    const subjectValue = template.subject?.trim() || `Segnalazione ${contextName}`;
    const bodyValue = (messageOverride ?? template.message ?? "").trim();
    const encodedSubject = encodeURIComponent(subjectValue);
    const encodedBody = encodeURIComponent(bodyValue).replace(/%0A/g, "%0D%0A");
    const queryParams = [`subject=${encodedSubject}`];
    if (bodyValue) {
      queryParams.push(`body=${encodedBody}`);
    }
    return `mailto:${channelValue}?${queryParams.join("&")}`;
  };

  const triggerMailto = (url: string) => {
    const tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.target = "_blank";
    tempLink.style.display = "none";
    tempLink.rel = "noopener";
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };

  const handle = useMemo(() => {
    if (!isSocialChannel) {
      return null;
    }
    return extractTwitterHandle(channelValue);
  }, [channelValue, isSocialChannel]);

  const baseMessage = handle ? `${handle} ` : "";

  const availableTemplates = useMemo(() => {
    const defined = templates ?? [];

    if (!isSocialChannel) {
      return defined;
    }

    const custom: MessageTemplateItem = {
      id: "custom",
      label: "Scrivi un messaggio libero",
      description: "Apri Twitter/X con il destinatario già compilato e completa il testo.",
      message: baseMessage
    };
    return [...defined, custom];
  }, [templates, baseMessage, isSocialChannel]);

  // Focus trap and ESC key handling for modal dialog
  useEffect(() => {
    if (!showLocationDialog) return;

    // Focus the first button when dialog opens
    gpsButtonRef.current?.focus();

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

    if (isEmailChannel) {
      setPendingTemplate(template);
      setShowLocationDialog(true);
      return;
    }

    setPendingTemplate(template);
    setShowLocationDialog(true);
  };

  const sendMessage = (message: string, template: MessageTemplateItem) => {
    if (isEmailChannel) {
      const mailtoUrl = buildMailtoUrl(template, message);
      triggerMailto(mailtoUrl);
    } else if (isSocialChannel) {
      const finalUrl = buildTwitterIntentUrl(message);
      window.open(finalUrl, "_blank", "noopener");
    }
  };

  const buildInitialMessage = (template: MessageTemplateItem): string => {
    let message = template.message || baseMessage;

    // Aggiungi l'hashtag #PaMiSenti solo se non è il template custom (messaggio libero)
    if (isSocialChannel && template.id !== "custom" && message.trim()) {
      message = `${message.trim()} #PaMiSenti`;
    }

    return message;
  };

  const handleUseGPS = async () => {
    if (!pendingTemplate) return;

    setIsLoadingLocation(true);
    setActiveTemplate(pendingTemplate.id);

    try {
      const coords = await requestCurrentPosition();
      const initialMessage = buildInitialMessage(pendingTemplate);
      let finalMessage = appendLocationLinkFromCoords(initialMessage, coords);

      if (isEmailChannel && finalMessage.includes("https://www.google.com/maps/place")) {
        finalMessage = finalMessage.replace(
          /\s(https:\/\/www\.google\.com\/maps\/place\/.+)$/i,
          "\n\n$1"
        );
      }

      sendMessage(finalMessage, pendingTemplate);
    } catch (error) {
      window.alert("Non è stato possibile recuperare la tua posizione GPS.");
    } finally {
      setIsLoadingLocation(false);
      setShowLocationDialog(false);
      setActiveTemplate(null);
      setPendingTemplate(null);
    }
  };

  const handleUseMap = () => {
    setShowLocationDialog(false);
    setShowMapPicker(true);
  };

  const handleMapConfirm = (coords: Coordinates) => {
    if (!pendingTemplate) return;

    const template = pendingTemplate;
    const initialMessage = buildInitialMessage(template);
    let finalMessage = appendLocationLinkFromCoords(initialMessage, coords);

    if (isEmailChannel && finalMessage.includes("https://www.google.com/maps/place")) {
      finalMessage = finalMessage.replace(
        /\s(https:\/\/www\.google\.com\/maps\/place\/.+)$/i,
        "\n\n$1"
      );
    }

    // Pulisci lo stato
    setPendingTemplate(null);
    setActiveTemplate(null);

    // Invia messaggio (modali già chiuse da onBeforeConfirm)
    sendMessage(finalMessage, template);
  };

  const handleMapClose = () => {
    setShowMapPicker(false);
    setShowLocationDialog(true); // Torna al dialog delle opzioni
  };

  const handleBeforeMapConfirm = () => {
    // Chiudi TUTTE le modali prima di processare coordinate
    setShowMapPicker(false);
    setShowLocationDialog(false);
  };

  const handleNoLocation = () => {
    if (!pendingTemplate) return;

    const initialMessage = buildInitialMessage(pendingTemplate);
    sendMessage(initialMessage, pendingTemplate);

    // Pulisci tutto lo stato
    setShowLocationDialog(false);
    setPendingTemplate(null);
    setActiveTemplate(null);
  };

  return (
    <>
      <section className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-brand">Messaggi precompilati</p>
          <h2 className="text-2xl font-semibold text-slate-900">{channelLabel}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {isEmailChannel
              ? "Scegli uno dei modelli e invia l'email con oggetto e testo già compilati. Potrai sempre modificare i dettagli nel tuo client di posta."
              : "Scegli uno dei modelli rapidi oppure apri Twitter/X con un messaggio libero. Potrai sempre modificare il testo prima dell'invio."}
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
                {isEmailChannel && template.subject ? (
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Oggetto: <span className="font-semibold text-slate-900">{template.subject}</span>
                  </p>
                ) : null}
                {isEmailChannel ? (
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p className="font-medium text-slate-700">Destinatari:</p>
                    <div className="flex flex-wrap gap-2">
                      {channelValue.split(",").map((recipient) => (
                        <span
                          key={recipient.trim()}
                          className="inline-flex items-center rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                        >
                          {recipient.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
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
                {isEmailChannel
                  ? "Scrivi email"
                  : activeTemplate === template.id
                    ? "Recupero posizione…"
                    : "Usa questo messaggio"}
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
          {isSocialChannel ? (
            <a
              className="text-sm text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:rounded"
              href={channelValue}
              target="_blank"
              rel="noreferrer"
              aria-label="Apri il profilo su Twitter/X (si apre in una nuova scheda)"
            >
              Apri il profilo su Twitter/X
            </a>
          ) : null}
          {isEmailChannel ? (
            <a
              className="text-sm text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:rounded"
              href={`mailto:${channelValue}`}
              aria-label="Scrivi una email ai destinatari indicati"
            >
              Scrivi una email manualmente
            </a>
          ) : null}
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
                  Puoi includere un link con la tua posizione attuale {isEmailChannel ? "nell'email" : "nel messaggio"} per facilitare
                  l&apos;intervento della PA.
                </p>
                <div className="mt-6 space-y-3">
                  <button
                    ref={gpsButtonRef}
                    className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50"
                    type="button"
                    onClick={handleUseGPS}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>GPS automatico</span>
                    </div>
                  </button>
                  <button
                    className="w-full rounded-lg border-2 border-brand bg-white px-4 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50"
                    type="button"
                    onClick={handleUseMap}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <span>Scegli su mappa</span>
                    </div>
                  </button>
                  <button
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
                    type="button"
                    onClick={handleNoLocation}
                  >
                    No, grazie
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Map Picker Modal */}
      {showMapPicker && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="text-white">Caricamento mappa...</div>
        </div>}>
          <MapPickerModal
            isOpen={showMapPicker}
            onClose={handleMapClose}
            onConfirm={handleMapConfirm}
            onBeforeConfirm={handleBeforeMapConfirm}
          />
        </Suspense>
      )}
    </>
  );
};

export default TemplatePicker;
