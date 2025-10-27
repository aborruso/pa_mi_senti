/**
 * Lazy loader per MapLibre GL
 * Importa la libreria solo quando necessario per ridurre il bundle iniziale
 */

import type maplibregl from "maplibre-gl";

let maplibreInstance: typeof maplibregl | null = null;

/**
 * Carica dinamicamente MapLibre GL e il CSS
 * @returns Promise con l'istanza di maplibregl
 */
export const loadMapLibre = async (): Promise<typeof maplibregl> => {
  if (maplibreInstance) {
    return maplibreInstance;
  }

  // Dynamic import per code splitting
  const [maplibre] = await Promise.all([
    import("maplibre-gl"),
    // Importa anche il CSS
    import("maplibre-gl/dist/maplibre-gl.css")
  ]);

  maplibreInstance = maplibre.default;
  return maplibreInstance;
};

/**
 * Resetta il cache (utile per testing)
 */
export const resetMapLibreCache = (): void => {
  maplibreInstance = null;
};
