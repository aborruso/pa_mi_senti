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

## Filosofia del progetto

I principi chiave che guidano lo sviluppo:

- **Nessuna registrazione o autenticazione**: il sistema non richiede account. L'utente si identifica solo quando contatta la PA attraverso il canale scelto (tweet, email, telefonata, ecc.).
- **Delega ai canali esistenti**: funzionalità come allegare foto, video o altri documenti sono delegate alle piattaforme utilizzate (Twitter/X, client email, ecc.). Il servizio si concentra solo sul facilitare l'accesso ai canali.
- **Messaggi precompilati**: disponibilità di template pronti per le segnalazioni più comuni (es. a Palermo la RAP risponde ai tweet, quindi è utile avere messaggi precompilati per cestini pieni, abbandoni, mancato spazzamento).
- **Geolocalizzazione opzionale**: per i canali social come Twitter/X, possibilità di raccogliere la posizione dell'utente (previo consenso) e includerla nel messaggio per facilitare l'intervento.
- **Facile estensibilità**: aggiungere nuove città, temi e canali deve essere semplice come modificare un file YAML, senza toccare il codice.

## Requisiti

- Deve poter girare su GitHub Pages, quindi HTML statico generato in build (stack basato su Astro JS).
- Usa Tailwind CSS per lo styling.
- Deve consentire di aggiungere nel tempo altre PA, basandosi su un'anagrafica di base in YAML.
- Ogni pagina deve essere associata a un permalink, in modo che qualsiasi step possa essere condiviso via URL.
- Url parlanti, ad esempio:
  - `https://esempio.it/citta/codice_istat_comune/index.html`
  - `https://esempio.it/citta/codice_istat_comune/nettezza_urbana/index.html`
- Offrire modelli precompilati (email, social come Twitter/X) configurabili tramite YAML dedicato, con una pagina di scelta prima dell'apertura del canale e possibilità di allegare le coordinate dell'utente.
