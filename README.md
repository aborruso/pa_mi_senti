# PA Mi Senti (Astro)

Sito statico generato con Astro che aiuta i cittadini a trovare rapidamente il canale giusto per contattare la Pubblica Amministrazione in base al tema della segnalazione. Ogni rotta viene pre-renderizzata per funzionare anche con URL condivisi direttamente (es. `https://aborruso.github.io/citta/082053/...`).

## Requisiti

- Node.js 20+
- npm 10+

## Avvio rapido

```bash
npm install
npm run dev
```

Apri `http://localhost:4321` per la versione locale. Tutti i permalink (`/citta/{istat}/{tema}/...`) sono generati staticamente durante la build.

## Comandi principali

- `npm run dev` — avvia Astro in modalità sviluppo con HMR.
- `npm run build` — genera la versione statica in `dist/` (pronta per GitHub Pages).
- `npm run preview` — avvia un server che serve la build prodotta.
- `npm run lint` — esegue ESLint sui file TypeScript/TSX.
- `npm run format` — verifica la formattazione con Prettier.

## Dati e modelli

I dati principali risiedono in:

- `src/data/pa.yml` — elenco municipalità, contesti e canali.
- `src/data/templates.yml` — modelli precompilati per i canali (es. Twitter).

Ogni modifica ai file YAML rigenera automaticamente le rotte statiche:

- `/citta/{istat}/` — elenco dei temi di una città.
- `/citta/{istat}/{tema}/` — dettagli e canali per un tema.
- `/citta/{istat}/{tema}/messaggi/{channelKey}/` — pagina di scelta dei messaggi con possibilità di allegare la posizione corrente.

## Deploy su GitHub Pages

Il workflow `/.github/workflows/deploy.yml` effettua build e deploy automatico a ogni push su `main`. Assicurati che le GitHub Pages siano configurate su “GitHub Actions” e che il sito sia pubblicato da `dist/`.
