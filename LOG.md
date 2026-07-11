# Registro Evoluzione Progetto

## 2026-06-30 — Ripristinato link Google Maps nel tweet

- Rimossa la guardia 280 che ometteva il link Maps sui social quando c'era l'indirizzo: ora si tengono ENTRAMBI (via + link)
- Motivo: Twitter conta ogni URL 23 caratteri fissi (t.co), nessun rischio reale di sforare i 280

## 2026-06-30 — Fix flusso GPS (regressione pre-open)

- Rimosso il pre-open della scheda (`window.open('','_blank')`): mandava la pagina in background facendo fallire `getCurrentPosition` ("non riesce geocoding") e impediva l'apertura dell'app Twitter (navigava twitter nel browser)
- Ripristinata apertura diretta `window.open(url)` dopo gli await → app Twitter di nuovo aperta correttamente
- `composeFinalMessage`: il reverse geocoding parte solo se il messaggio contiene `{indirizzo}` (messaggi liberi saltano la chiamata di rete)
- Verificato che Nominatim risponde 200 + CORS `*` da origine GitHub Pages

## 2026-06-30 — Reverse geocoding indirizzo (issue #14)

- `reverseGeocode()` in `src/lib/location.ts`: coords → nome via via Nominatim (OSM), nessuna API key, timeout 2.5s con AbortController, fallback null
- `TemplatePicker`: sostituisce `{indirizzo}` con l'indirizzo ricavato (GPS e mappa); campo sempre modificabile dall'utente nel client
- Guard popup-blocking: per i canali social la scheda è pre-aperta nel gesto utente prima degli await, poi si imposta `location.href`
- Guard 280 caratteri: su social, se l'indirizzo è risolto si omette il link Maps (lo sostituisce); link mantenuto solo come fallback o per email
- Privacy aggiornata: invio coordinate a Nominatim dichiarato
- Build + lint ok

## 2025-11-02 — Pagine legali

- Aggiunte pagine Privacy Policy e Disclaimer accessibili dal footer
- Privacy Policy copre: geolocalizzazione GPS/mappa opzionale, zero tracking/cookie, link esterni (OpenStreetMap, GitHub Pages, MapLibre)
- Disclaimer specifica: contatti PA verificati manualmente ma non garantiti, nessuna responsabilità su accuratezza, verificare su siti PA ufficiali
- Footer aggiornato con link "Privacy | Disclaimer" su tutte le pagine (responsive: mobile flex-col, desktop flex-row con pipe)
- Path helpers buildPrivacyPath() e buildDisclaimerPath() aggiunti a src/lib/paths.ts
- Build genera correttamente /privacy/index.html e /disclaimer/index.html
- Link stilizzati con focus states accessibili (focus-visible:ring-2, hover:text-slate-700)

## 2025-11-02 — Mappa UX

- Migliorata UX mappa interattiva: da marker draggable a pin fisso al centro
- Utente sposta/zooma mappa, pin resta centrato, coordinate si aggiornano automaticamente
- Pattern più intuitivo e mobile-friendly (stile Uber, delivery apps)
- Event `moveend` sostituisce `dragend` per update coordinate
- Pin SVG CSS-positioned, nessun elemento MapLibre draggable
- Modificato solo `MapPickerModal.tsx`, nessun breaking change

## 2025-10-27

- Release 2: mappa interattiva per scelta manuale coordinate
- Aggiunta MapLibre GL con tiles OpenStreetMap (lazy loading ~260KB gzipped)
- Dialog geolocalizzazione ora offre 3 opzioni: GPS automatico, scegli su mappa, nessuna posizione
- Mappa con marker draggable, button GPS integrato, coordinate display
- GPS automatico all'apertura mappa se posizione non già fornita
- Refactoring location.ts: nuova funzione `appendLocationLinkFromCoords()` per coords manuali
- Fix chiusura modali dopo conferma posizione da mappa

## 2024-10-25

- Ottimizzato workflow GitHub Actions per evitare deploy quando si modificano solo file di documentazione
- Creato documento IDEAS.md per raccogliere proposte di miglioramento futuro (prima idea: GitHub Issue Forms come YAML builder)
- Creato documento CONTRIBUIRE.md con guida completa per proporre aggiunte (città, temi, template, canali)
- Creato documento CLAUDE.md con istruzioni per Claude Code
- Migliorata formattazione markdown in CONTRIBUIRE.md (righe vuote prima di elenchi e blocchi di codice)
- Standardizzati placeholder nei template da `{indirizzo/piazza}` a `{indirizzo}`
- Migliorata leggibilità file YAML con commenti esplicativi e formato multilinea per note lunghe

## 2024-10-19

- Creato documento copilot-instructions.md con istruzioni per GitHub Copilot

## 2024-08-15

- creazione Pagina Info
- aggiunto opengraph metadata

## 2024-08-11 — Migrazione ad Astro

- Ricreato il progetto con Astro + Tailwind + integrazione React per componenti interattivi.
- Generazione statica di tutte le rotte (`/citta/{istat}/...`) partendo dai dati YAML in `src/data/`.
- Pagina dei messaggi Twitter/X con modelli precompilati e opzione per allegare la posizione tramite geolocalizzazione client-side.
- Aggiornato workflow GitHub Pages per la nuova toolchain Astro.
