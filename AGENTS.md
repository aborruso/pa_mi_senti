# Agent Guidelines

## Commands

- Dev: `npm run dev` (Vite with hot reload)
- Build: `npm run build` (static dist/ for GitHub Pages)
- Test all: `npm run test` (runs Vitest + data validation)
- Test single: `npx vitest run src/tests/routes.test.ts` or `npx vitest src/lib/routes`
- Lint: `npm run lint` (ESLint on .ts/.tsx files)
- Format check: `npm run format` (Prettier)

## Code Style

- **Indentation**: 2 spaces (enforced by Prettier)
- **Quotes**: Single quotes, printWidth 90, no trailing commas
- **Imports**: React types from 'react', group by external→internal→types
- **Types**: Explicit return types optional (TSConfig strict mode); import `type` for type-only imports
- **Naming**: PascalCase components, camelCase functions/hooks, snake_case YAML keys
- **Components**: Functional with TypeScript; use `PropsWithChildren` for children props
- **Error handling**: Show `<ErrorState>` with retry callback; no console errors in production
- **File structure**: Colocate `.test.ts` next to implementation; types in `src/types/`
- **YAML**: snake_case keys (istat_code, primary_channel); validate with `scripts/validate-data.ts`

## Before Committing

Run `npm run lint && npm run test && npm run build` to ensure CI readiness.
