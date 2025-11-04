## 1. Aggiornamento dati Palermo

- [ ] 1.1 Aggiungere contesto "verde pubblico" in `src/data/pa.yml` per Palermo (istat 082053)
- [ ] 1.2 Configurare canale email areaverde@resetpalermo.it con label appropriata
- [ ] 1.3 Impostare colori tema verde (bg-emerald-50) e emoji (🌳)

## 2. Verifica generazione percorsi

- [ ] 2.1 Eseguire `npm run build` per verificare generazione percorso `/citta/082053/verde_pubblico/`
- [ ] 2.2 Verificare che la pagina mostri correttamente il canale email
- [ ] 2.3 Testare navigazione breadcrumb dalla home a Palermo a verde pubblico

## 3. Validazione e test

- [ ] 3.1 Eseguire `npm run lint` per verificare conformità codice
- [ ] 3.2 Verificare accessibilità della nuova sezione
- [ ] 3.3 Testare link email areaverde@resetpalermo.it apre client email
