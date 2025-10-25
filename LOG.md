# Registro Evoluzione Progetto

## 2024-10-25

- Ottimizzato workflow GitHub Actions per evitare deploy quando si modificano solo file di documentazione
- Creato documento IDEAS.md per raccogliere proposte di miglioramento futuro (prima idea: GitHub Issue Forms come YAML builder)
- Creato documento CONTRIBUIRE.md con guida completa per proporre aggiunte (città, temi, template, canali)
- Migliorata formattazione markdown in CONTRIBUIRE.md (righe vuote prima di elenchi e blocchi di codice)
- Standardizzati placeholder nei template da `{indirizzo/piazza}` a `{indirizzo}`
- Migliorata leggibilità file YAML con commenti esplicativi e formato multilinea per note lunghe

## 2024-10-19

- Creato documento CLAUDE.md con istruzioni per Claude Code
- Aggiunto link alla guida per contribuire nel layout principale
- Migliorata documentazione Copilot con dettagli su architettura e pattern

## 2024-08-15

- creazione Pagina Info
- aggiunto opengraph metadata

## 2024-08-11 — Migrazione ad Astro

- Ricreato il progetto con Astro + Tailwind + integrazione React per componenti interattivi.
- Generazione statica di tutte le rotte (`/citta/{istat}/...`) partendo dai dati YAML in `src/data/`.
- Pagina dei messaggi Twitter/X con modelli precompilati e opzione per allegare la posizione tramite geolocalizzazione client-side.
- Aggiornato workflow GitHub Pages per la nuova toolchain Astro.
