# PA Mi Senti

Interfaccia web statica (compatibile con GitHub Pages) che aiuta i cittadini a trovare rapidamente il canale giusto per contattare la Pubblica Amministrazione in base al tema della segnalazione.

## Requisiti

- Node.js 20+
- npm 10+

## Avvio rapido

```bash
npm install
npm run dev
```

La pagina di sviluppo è raggiungibile su `http://localhost:5173`. La navigazione client-side genera permalink del tipo `/citta/{istat}/{tema}`.

## Comandi principali

- `npm run build` — produce la versione statica in `dist/` pronta per GitHub Pages.
- `npm run lint` — controlla lo stile con ESLint e TypeScript.
- `npm run test` — lancia Vitest e valida la struttura YAML (`npm run data:check`).
- `npm run preview` — avvia un server locale sulla build prodotta.

## Dati anagrafici PA

Aggiorna `public/data/pa.yml` per aggiungere nuove municipalità o contesti. Ogni città deve includere un codice ISTAT e almeno un canale per contesto. Esegui `npm run data:check` per validare il file.

I modelli di messaggio per email o social sono raccolti in `public/data/templates.yml`, organizzati per contesto e canale (identificato dal campo `key`). Quando il canale supporta modelli (es. Twitter), l’utente sceglie prima il testo da inviare e poi viene reindirizzato al canale selezionato.
