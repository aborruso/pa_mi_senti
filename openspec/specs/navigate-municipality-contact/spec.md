# navigate-municipality-contact Specification

## Purpose
TBD - created by archiving change add-contact-flow-specs. Update Purpose after archive.
## Requirements
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

### Requirement: Present context channels with type-aware actions
Every context page MUST render the configured contact channels with labels, notes, and the appropriate action (link, tel, mailto) based on the YAML definition.

#### Scenario: Telefonic channel renders tel link
- **GIVEN** the `nettezza_urbana` context includes a phone channel with value `800237713`
- **WHEN** the context page is rendered
- **THEN** the channel shows the label "RAP Numero Verde"
- **AND** the value links to `tel:800237713`

#### Scenario: Social channel with template key links to message page
- **GIVEN** the `palermo-rap-twitter` channel is of type `social` with platform `twitter` and a `key`
- **WHEN** the context page is rendered
- **THEN** the card CTA reads "Scrivigli su Twitter/X"
- **AND** its href resolves to `/citta/082053/nettezza_urbana/messaggi/palermo-rap-twitter/`

### Requirement: Expose template picker routes only for eligible channels
The build MUST create `messaggi/{channelKey}` routes exclusively for channels that provide a `key` and are either Twitter/X or email, and those pages MUST pass the channel metadata to the template picker component.

#### Scenario: Social template route is generated
- **GIVEN** `palermo-rap-twitter` is a social channel with a `key`
- **WHEN** the static build runs
- **THEN** Astro emits `/citta/082053/nettezza_urbana/messaggi/palermo-rap-twitter/index.html`
- **AND** the rendered page hydrates `TemplatePicker` with the municipality, context, and channel details

#### Scenario: Phone-only channels do not create template routes
- **GIVEN** the `RAP Numero Verde` channel is of type `phone` and has no `key`
- **WHEN** the static build runs
- **THEN** no `messaggi` route is generated for that channel
- **AND** the context page only renders a `tel:` action for the phone number

