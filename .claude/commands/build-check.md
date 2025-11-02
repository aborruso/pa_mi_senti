Esegui un controllo completo del progetto prima del commit:

1. Valida sintassi YAML dei file dati:
   - Verifica `src/data/pa.yml` con un parser YAML (es. python3 -c "import yaml; yaml.safe_load(open('src/data/pa.yml'))")
   - Verifica `src/data/templates.yml` allo stesso modo
   - Se errori YAML, fermati e segnala

2. Esegui build di produzione:
   - `npm run build`
   - Se fallisce, segnala errori e fermati

3. Avvia preview se build ok:
   - `npm run preview` in background
   - Segnala URL per testing manuale
   - Ricorda all'utente di testare manualmente e poi killare il processo

Fornisci output conciso con stato di ogni step (✓ o ✗).
