## MODIFIED Requirements

### Requirement: Generate static navigation from registry

The site MUST derive cities and themes from `src/data/pa.yml` and pre-render a static, shareable route for each step of the contact flow.

#### Scenario: Build time creates municipality paths

- **GIVEN** the registry lists a municipality with ISTAT code `082053`
- **WHEN** the static build runs
- **THEN** the home page lists Palermo and links to `/citta/082053/`
- **AND** Astro emits an HTML file for `/citta/082053/index.html`

#### Scenario: Build time creates context paths

- **GIVEN** Palermo in the registry contains the `nettezza_urbana` context
- **WHEN** the static build runs
- **THEN** Astro emits an HTML file for `/citta/082053/nettezza_urbana/index.html`
- **AND** the page breadcrumb links back to `/` and `/citta/082053/`

#### Scenario: Build time creates verde pubblico context path

- **GIVEN** Palermo in the registry contains the `verde_pubblico` context
- **WHEN** the static build runs
- **THEN** Astro emits an HTML file for `/citta/082053/verde_pubblico/index.html`
- **AND** the page breadcrumb links back to `/` and `/citta/082053/`
- **AND** the context page displays channels for manutenzione e verde pubblico
