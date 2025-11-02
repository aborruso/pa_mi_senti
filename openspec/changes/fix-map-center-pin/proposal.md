# Proposal: Fix map center pin interaction

## Summary

Cambia il comportamento della selezione manuale della posizione nella mappa da "marker draggabile" a "pin fisso al centro + mappa mobile". L'utente sposta e zooma la mappa, il pin rimane sempre al centro e le coordinate vengono aggiornate in base al centro della vista.

## Motivation

L'attuale implementazione richiede all'utente di trascinare un marker sulla mappa. Questo pattern UX è meno intuitivo rispetto al pattern "pin fisso al centro" usato da app popolari (Uber, Lyft, delivery apps). Con il pin fisso:

- L'interazione è più naturale: l'utente sposta la mappa con pan/zoom senza dover trascinare un elemento specifico
- Funziona meglio su mobile: il pan è più fluido del drag di un marker piccolo
- Riduce gli errori di selezione: il centro è sempre visibile e preciso
- È più accessibile: nessun elemento da afferrare, solo pan standard della mappa

## Impact

**User-facing:**
- UX migliorata per la selezione manuale della posizione
- Interazione più fluida su mobile e desktop
- Nessun cambiamento visivo significativo (solo il marker diventa fisso)

**Technical:**
- Modifica a `src/components/react/MapPickerModal.tsx`
- Il marker non è più draggable
- Le coordinate si aggiornano sull'evento `moveend` della mappa invece di `dragend` del marker
- Il pin è posizionato al centro del viewport (CSS)

**Backward compatibility:**
- Nessun impatto: il comportamento esterno rimane identico (la modale restituisce comunque coordinate)
- I template e i link Google Maps continuano a funzionare allo stesso modo

## Scope

- **In scope:**
  - Rendere il marker non-draggable e posizionarlo fisso al centro
  - Aggiornare le coordinate in base al centro della mappa durante pan/zoom
  - Aggiornare il display delle coordinate in tempo reale durante il movimento
  - Aggiornare i testi di help per riflettere la nuova interazione

- **Out of scope:**
  - Modifiche al flow di geolocalizzazione GPS
  - Modifiche ai template o ai messaggi generati
  - Cambio di libreria mappa o tile provider

## Related Changes

None - questa è una miglioria UX isolata alla modale di selezione manuale.

## Risks & Mitigations

**Risk:** L'utente potrebbe essere confuso se era abituato al marker draggabile
**Mitigation:** Il nuovo pattern è più comune e intuitivo; il testo di help sarà aggiornato

**Risk:** Performance con aggiornamenti continui delle coordinate durante il pan
**Mitigation:** L'evento `moveend` viene emesso solo al termine del movimento, non durante
