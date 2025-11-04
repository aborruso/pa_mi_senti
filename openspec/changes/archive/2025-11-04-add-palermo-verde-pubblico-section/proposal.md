## Why

Palermo necessita di una sezione dedicata al verde pubblico per permettere ai cittadini di segnalare problemi relativi a manutenzione di parchi, alberi, aree verdi e spazi pubblici verdi. Questo risponde a una esigenza specifica della città e completa l'offerta di servizi di segnalazione.

## What Changes

- Aggiungere il contesto "verde pubblico" a Palermo in `src/data/pa.yml` con slug `verde_pubblico`
- Configurare il canale email `areaverde@resetpalermo.it` per segnalazioni di manutenzione e verde
- Utilizzare i colori predisposti per il tema verde (bg-emerald-50, bg-lime-50)

## Impact

- Affected specs: navigate-municipality-contact
- Affected code: `src/data/pa.yml`
- Nuovo percorso statico: `/citta/082053/verde_pubblico/`
- Nessun breaking change, solo aggiunta di funzionalità
