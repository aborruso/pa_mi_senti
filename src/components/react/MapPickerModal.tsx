import { useEffect, useRef, useState } from "react";
import { loadMapLibre } from "../../lib/map-loader";
import { requestCurrentPosition } from "../../lib/location";
import type { Map as MapLibreMap } from "maplibre-gl";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (coords: Coordinates) => void;
  onBeforeConfirm?: () => void;
  initialCoords?: Coordinates;
}

// Default: centro Italia
const DEFAULT_CENTER: Coordinates = {
  latitude: 41.9028,
  longitude: 12.4964
};

const DEFAULT_ZOOM = 6;
const PICKED_ZOOM = 16;

const MapPickerModal = ({
  isOpen,
  onClose,
  onConfirm,
  onBeforeConfirm,
  initialCoords
}: MapPickerModalProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<Coordinates>(
    initialCoords || DEFAULT_CENTER
  );
  const [mapError, setMapError] = useState<string | null>(null);
  const [hasRequestedInitialGPS, setHasRequestedInitialGPS] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || mapRef.current) {
      return;
    }

    let isMounted = true;

    const initMap = async () => {
      try {
        setIsLoadingMap(true);
        setMapError(null);

        const maplibre = await loadMapLibre();

        if (!isMounted || !mapContainerRef.current) {
          return;
        }

        // Prova a ottenere posizione GPS automaticamente se non fornita
        let startCoords = initialCoords || DEFAULT_CENTER;
        let startZoom = initialCoords ? PICKED_ZOOM : DEFAULT_ZOOM;

        if (!initialCoords && !hasRequestedInitialGPS) {
          setHasRequestedInitialGPS(true);
          try {
            const gpsCoords = await requestCurrentPosition();
            if (isMounted) {
              startCoords = gpsCoords;
              startZoom = PICKED_ZOOM;
            }
          } catch (error) {
            // GPS fallito o negato, usa default (Roma)
            console.log("GPS non disponibile, uso centro Italia");
          }
        }

        // Create map
        const map = new maplibre.Map({
          container: mapContainerRef.current,
          style: {
            version: 8,
            sources: {
              "osm-tiles": {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            },
            layers: [
              {
                id: "osm-tiles-layer",
                type: "raster",
                source: "osm-tiles",
                minzoom: 0,
                maxzoom: 19
              }
            ]
          },
          center: [startCoords.longitude, startCoords.latitude],
          zoom: startZoom
        });

        mapRef.current = map;

        // Update coordinates when map stops moving
        map.on("moveend", () => {
          const center = map.getCenter();
          setCurrentCoords({
            latitude: center.lat,
            longitude: center.lng
          });
        });

        map.on("load", () => {
          if (isMounted) {
            setIsLoadingMap(false);
            closeButtonRef.current?.focus();
            // Set initial coordinates after load
            const center = map.getCenter();
            setCurrentCoords({
              latitude: center.lat,
              longitude: center.lng
            });
          }
        });

      } catch (error) {
        console.error("Errore inizializzazione mappa:", error);
        if (isMounted) {
          setMapError("Impossibile caricare la mappa. Riprova più tardi.");
          setIsLoadingMap(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen, initialCoords]);

  // Focus trap and ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoadingGPS) {
        onClose();
      }

      // Trap focus within dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

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
  }, [isOpen, isLoadingGPS, onClose]);

  const handleUseGPS = async () => {
    if (!mapRef.current) {
      return;
    }

    setIsLoadingGPS(true);

    try {
      const coords = await requestCurrentPosition();

      // Center map on new position (moveend will update coordinates)
      mapRef.current.flyTo({
        center: [coords.longitude, coords.latitude],
        zoom: PICKED_ZOOM,
        duration: 1500
      });
    } catch (error) {
      window.alert("Non è stato possibile recuperare la tua posizione GPS.");
    } finally {
      setIsLoadingGPS(false);
    }
  };

  const handleConfirm = () => {
    // Chiudi modale parent PRIMA di processare coordinate
    onBeforeConfirm?.();
    onConfirm(currentCoords);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-picker-title"
    >
      <div
        ref={dialogRef}
        className="flex h-full flex-col"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <h2 id="map-picker-title" className="text-lg font-semibold text-slate-900">
              Scegli la posizione sulla mappa
            </h2>
            <p className="text-sm text-slate-600">
              Sposta la mappa per posizionare il marcatore al centro
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            disabled={isLoadingGPS}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Chiudi mappa"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        {/* Map container */}
        <div className="relative flex-1">
          {isLoadingMap && !mapError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <div className="text-center">
                <div
                  className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"
                  role="status"
                  aria-label="Caricamento mappa"
                ></div>
                <p className="mt-4 text-sm text-slate-600">Caricamento mappa...</p>
              </div>
            </div>
          )}

          {mapError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white p-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900">Errore</p>
                <p className="mt-2 text-sm text-slate-600">{mapError}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  Chiudi
                </button>
              </div>
            </div>
          )}

          <div
            ref={mapContainerRef}
            className="h-full w-full"
            aria-label="Mappa interattiva per scegliere posizione"
          />

          {/* Fixed center pin */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full"
            aria-hidden="true"
          >
            <svg
              width="40"
              height="48"
              viewBox="0 0 40 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 0C9.4 0 0 8.4 0 20c0 14 20 28 20 28s20-14 20-28C40 8.4 30.6 0 20 0zm0 28c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"
                fill="#8b5cf6"
              />
              <circle cx="20" cy="20" r="5" fill="white" />
            </svg>
          </div>

          {/* GPS Button overlay */}
          {!isLoadingMap && !mapError && (
            <div className="absolute left-4 top-4 z-10">
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={isLoadingGPS}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Usa posizione GPS"
              >
                {isLoadingGPS ? (
                  <>
                    <div
                      className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent"
                      role="status"
                    ></div>
                    <span>Rilevamento GPS...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
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
                    <span>Usa posizione GPS</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Coordinates display */}
          {!isLoadingMap && !mapError && (
            <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-lg backdrop-blur">
              <span className="font-mono">
                {currentCoords.latitude.toFixed(5)}, {currentCoords.longitude.toFixed(5)}
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white p-4 shadow-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoadingGPS}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoadingMap || isLoadingGPS || !!mapError}
            className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:bg-brand/60"
          >
            Conferma posizione
          </button>
        </footer>
      </div>
    </div>
  );
};

export default MapPickerModal;
