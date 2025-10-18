# Intro

È un progetto che vuole rendere facile contattare una Pubblica Amministrazione, per fare richieste e segnalazioni.

È una pagina web visibile sia da mobile che da desktop

Non richiede autenticazione, perché ognuno poi, in base al canale (email, segnalazione su x), userà il proprio account.

## Come funziona

- All'avvio l'utente avrà l'elenco delle città
- poi sceglie il contesta
	- nettezza_urbana
	- verde pubblico
	- strade

## Requisiti

- deve poter girare su github pages, quindi html e js. Un sito web
- usa tailwind css
- deve consentire di aggiungere nel tempo altre PA, basandosi su un'anagrafica di base in YAML
- ogni pagina deve essere associata a un permalink, in modo che qualsiasi step può essere associato a un url
- l'ideale è avere url parlanti. Ad esempio: 
	- https://esempio.it/citta/codice_istat_comune/index.html
	- https://esempio.it/citta/codice_istat_comune/nettezza_urbana/index.html
- offrire modelli precompilati (email, social come Twitter/X) configurabili tramite un file YAML dedicato, con una pagina di scelta prima dell'apertura del canale.
