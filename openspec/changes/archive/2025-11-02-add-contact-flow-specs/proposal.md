## Why
- Documentare il comportamento attuale del flusso "PA Mi Senti" in assenza di specifiche approvate
- Garantire che la generazione statica delle pagine per città, temi e canali resti un vincolo esplicito
- Formalizzare i requisiti di composizione dei messaggi e condivisione della posizione prima di ulteriori evoluzioni

## What Changes
- Nuova capability `navigate-municipality-contact` che descrive la navigazione dai comuni ai canali basata su dati YAML
- Nuova capability `compose-channel-messages` che copre template social/email, hashtag automatico e opzioni di geolocalizzazione

## Impact
- Nessun cambiamento di codice previsto, solo aggiunta di specifiche per future evoluzioni
- Allineamento del team sugli scenari core prima di proporre nuove funzionalità o refactor
