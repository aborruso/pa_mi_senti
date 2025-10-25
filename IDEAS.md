# Idee per il Futuro

Questo documento raccoglie idee e proposte di miglioramento per PA Mi Senti.

## GitHub Issue Forms come YAML Builder

Creare template strutturati per le issue GitHub che permettano agli utenti di contribuire senza conoscere la sintassi YAML.

**Come funzionerebbe**:

1. Utente compila un form (es. "Aggiungi nuova città")
2. Issue creata automaticamente con dati strutturati
3. GitHub Action legge l'issue e genera una Pull Request con le modifiche a `pa.yml` / `templates.yml`
4. Maintainer rivede la PR e fa merge

**Benefici**:

- Abbassa la barriera di ingresso per i contributori
- Riduce errori di sintassi YAML
- Mantiene controllo tramite review delle PR
- Automatizza il lavoro ripetitivo

**Template da creare**:

- Nuova città
- Nuovo tema (context)
- Nuovi messaggi precompilati
- Nuovo canale di contatto
