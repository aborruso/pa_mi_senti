# Project Context

## Purpose
PA Mi Senti facilita i cittadini nel contattare la Pubblica Amministrazione per segnalazioni puntuali (es. igiene urbana, viabilità). Il sito offre percorsi rapidi per trovare il canale corretto, compilare messaggi predefiniti e opzionalmente allegare geolocalizzazione, tutto senza raccolta di dati o necessità di registrazione. L’obiettivo è mantenere un’esperienza statica, veloce e facilmente estendibile con nuove città e temi tramite semplici file di configurazione.

## Tech Stack
- Astro 4.x per la generazione statica del sito e il routing file-based
- React 18 con idratazione selettiva per componenti interattivi (es. picker messaggi, mappe)
- TypeScript end-to-end con ESLint/Prettier per la qualità del codice
- Tailwind CSS 3 per lo styling utility-first e palette brand configurata in `tailwind.config.cjs`
- YAML per la configurazione dei dati (`src/data/pa.yml`, `src/data/templates.yml`)
- Node.js 20+ e npm 10+ come runtime e gestore pacchetti
- Deploy automatico su GitHub Pages (`astro build` → `dist/`)

## Project Conventions

### Code Style
- TypeScript come linguaggio principale con tipizzazione centralizzata in `src/lib/types.ts`
- ESLint (`npm run lint`) e Prettier (`npm run format`) garantiscono stile coerente
- Componenti Astro minimali; React solo dove serve interattività e sempre con `client:*` appropriato
- Tailwind come stile di default; nuovi colori vanno aggiunti alla safelist nel config
- Slug, chiavi YAML e permalink in `snake_case`; hashtag `#PaMiSenti` aggiunto automaticamente dal codice
- Preferire helper condivisi (es. `src/lib/paths.ts`, `src/lib/data.ts`) invece di duplicare logica

### Architecture Patterns
- Generazione completamente statica delle rotte `/citta/{istat}/{tema}/...` via `getStaticPaths`
- Dati caricati da YAML in fase di build; nessun database o API runtime
- Componenti React idratati on-demand per funzioni avanzate (TemplatePicker, MapPickerModal, geolocalizzazione)
- Libreria `src/lib/` centralizza utilità per path, geolocalizzazione, social, mappe
- Geolocalizzazione gestita lato client con fallback manuale; mappe basate su MapLibre GL e tile OpenStreetMap caricati solo quando richiesti
- Base path configurabile tramite `ASTRO_BASE` per garantire compatibilità tra dev e GitHub Pages

### Testing Strategy
- Non esiste suite automatizzata; test manuali fondamentali per nuove funzionalità
- Prima del merge verificare `npm run lint`, `npm run build` e, se rilevante, `npm run preview`
- Convalida manuale dei permalink generati e dei template social dopo modifiche a dati YAML o routing
- Per logica complessa, valutare test mirati o proof-of-concept in branch separati prima del merge

### Git Workflow
- Commits seguono lo standard Conventional Commits (`feat:`, `fix:`, `chore:`…)
- PR preferibilmente brevi, con descrizione chiara, link a ticket e toggle di lint/build eseguiti
- Verifica locale (`npm run lint`, `npm run build`) da riportare nella PR
- Deploy automatico su GitHub Pages su push in `main`; mantenere lo stato di `dist/` derivato dalla build

## Domain Context
- Focus sulla comunicazione Cittadini → Pubblica Amministrazione italiana, partendo da Palermo (istat `082053`)
- Temi organizzati per contesto (es. igiene urbana, polizia municipale) con canali ufficiali (social, email, telefono, form)
- Messaggi precompilati pensati per Twitter/X con placeholders e hashtag unificato `#PaMiSenti`
- Esperienza privacy-first: nessuna raccolta dati, niente backend, geolocalizzazione facoltativa e rispettosa
- Accessibilità prioritaria: navigazione tastiera, focus evidente, supporto screen reader, modali accessibili

## Important Constraints
- Mantenere la generazione statica delle rotte; niente rendering dinamico lato server
- Non introdurre dipendenze che richiedano backend, database o storage persistente
- Rispettare la privacy: nessun tracciamento, cookie o analytics invasivi
- Geolocalizzazione deve restare opzionale e trasparente, con fallback manuale
- Performance e bundle leggeri: caricare mappe e componenti pesanti solo on-demand
- Conservare coerenza di slug/chiavi per evitare rottura di permalink pubblici

## External Dependencies
- GitHub Pages per l’hosting statico e pipeline di deploy GitHub Actions
- MapLibre GL JS e tile OpenStreetMap per la selezione manuale della posizione
- API `navigator.geolocation` dei browser per il GPS automatico
- Canali esterni della PA (Twitter/X, email, form istituzionali, telefono) aperti in nuove finestre
- Dipendenze Node principali: Astro, React, Tailwind, @astrojs integrations come configurate in `astro.config.mjs`
