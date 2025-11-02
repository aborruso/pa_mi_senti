# Registro Evoluzione Progetto

## 2025-11-02

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
