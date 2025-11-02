# Design: Map Center Pin

## Current Behavior

Il componente `MapPickerModal` crea un marker MapLibre draggable:

```typescript
const marker = new maplibre.Marker({
  draggable: true,
  color: "#8b5cf6"
})
  .setLngLat([startCoords.longitude, startCoords.latitude])
  .addTo(map);

marker.on("dragend", () => {
  const lngLat = marker.getLngLat();
  setCurrentCoords({ latitude: lngLat.lat, longitude: lngLat.lng });
});
```

L'utente trascina il marker e le coordinate si aggiornano all'evento `dragend`.

## Proposed Behavior

### Pin Fisso al Centro (CSS)

Invece di un marker MapLibre draggable, usiamo un elemento DOM fisso al centro del contenitore mappa:

```tsx
<div className="map-container">
  <div ref={mapContainerRef} className="map" />
  <div className="center-pin">
    {/* SVG icon del pin */}
  </div>
</div>
```

CSS:
```css
.map-container { position: relative; }
.center-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%); /* Point del pin al centro */
  pointer-events: none;
  z-index: 10;
}
```

### Update Coordinate su Move

Le coordinate si aggiornano quando la mappa si ferma dopo un pan o zoom:

```typescript
map.on("moveend", () => {
  const center = map.getCenter();
  setCurrentCoords({
    latitude: center.lat,
    longitude: center.lng
  });
});
```

### Vantaggi

1. **Performance:** Nessun evento `drag` continuo, solo `moveend` discreto
2. **Semplicità:** Meno gestione di stato, nessun sincronizzazione marker ↔ mappa
3. **Accessibilità:** Pan/zoom sono operazioni standard, ben supportate da screen reader e tastiera
4. **Mobile-friendly:** Pan con touch è più fluido che drag di un marker

## Implementation Plan

1. **Rimuovi marker draggable MapLibre**
   - Non creare più il `Marker` con `draggable: true`
   - Rimuovi l'event listener `dragend`

2. **Aggiungi pin fisso CSS**
   - Crea elemento DOM sovrapposto al centro del map container
   - Usa SVG per il pin con colore brand (#8b5cf6)
   - Posiziona con `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -100%)`

3. **Ascolta evento `moveend`**
   - Quando la mappa si ferma dopo pan/zoom, leggi `map.getCenter()`
   - Aggiorna `currentCoords` state
   - Il display delle coordinate si aggiorna automaticamente via React

4. **Aggiorna testi di help**
   - Header: "Sposta la mappa per posizionare il marcatore al centro" (invece di "Trascina il marcatore")
   - Il resto del flow rimane identico

5. **GPS button behavior**
   - Quando l'utente clicca "Usa posizione GPS", la mappa fa `flyTo` alla nuova posizione
   - L'evento `moveend` alla fine del flyTo aggiornerà le coordinate automaticamente

## Testing Checklist

- [ ] Pan mappa: coordinate si aggiornano al termine del movimento
- [ ] Zoom mappa: coordinate rimangono al centro della nuova vista
- [ ] Click "Usa posizione GPS": mappa vola alla posizione, coordinate aggiornate
- [ ] Display coordinate in tempo reale durante il movimento
- [ ] Pin visibile e centrato su desktop e mobile
- [ ] Conferma posizione restituisce le coordinate corrette
- [ ] Nessun errore console durante interazione mappa
