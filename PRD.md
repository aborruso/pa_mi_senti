# Intro

È un progetto che vuole rendere facile contattare una Pubblica Amministrazione, per fare richieste e segnalazioni.

È una pagina web visibile sia da mobile che da desktop.

Non richiede autenticazione, perché ognuno poi, in base al canale (email, segnalazione su X), userà il proprio account.

## Come funziona

- All'avvio l'utente avrà l'elenco delle città.
- Poi sceglie il contesto
  - nettezza_urbana
  - verde pubblico
  - strade

## Requisiti

- Deve poter girare su GitHub Pages, quindi HTML statico generato in build (stack basato su Astro JS).
- Usa Tailwind CSS per lo styling.
- Deve consentire di aggiungere nel tempo altre PA, basandosi su un'anagrafica di base in YAML.
- Ogni pagina deve essere associata a un permalink, in modo che qualsiasi step possa essere condiviso via URL.
- Url parlanti, ad esempio:
  - `https://esempio.it/citta/codice_istat_comune/index.html`
  - `https://esempio.it/citta/codice_istat_comune/nettezza_urbana/index.html`
- Offrire modelli precompilati (email, social come Twitter/X) configurabili tramite YAML dedicato, con una pagina di scelta prima dell'apertura del canale e possibilità di allegare le coordinate dell'utente.
