# Registro Evoluzione Progetto

## 2024-08-10 — Bootstrap iniziale
- Creato scaffolding Vite + React + Tailwind con routing client-side e pagine permalink `/citta/{istat}/[tema]`.
- Aggiunte prime municipalità (Milano, Bologna, Palermo) con contesti tematici gestiti da `public/data/pa.yml`.
- Introdotto flusso per canali Twitter con pagina di template personalizzati (`public/data/templates.yml`) e possibilità di aggiungere automaticamente link alla posizione corrente.
- Configurato GitHub Actions (`.github/workflows/deploy.yml`) per build, lint/test e deploy automatico su GitHub Pages.
