# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Perlitas WebApp — a React + TypeScript SPA for budget/finance management (scenarios, cost centers, accounting entries) for "Aguas Perlitas". Consumes a REST backend at `/api` (proxied to `http://localhost:5000` in dev, see [vite.config.ts](vite.config.ts)). Deployed to IIS as a static SPA (see [public/web.config](public/web.config), which rewrites all non-file requests to `index.html` for React Router).

UI strings and comments in the codebase are in Spanish; keep new UI text and user-facing error messages in Spanish for consistency.

## Commands

- `npm run dev` — start Vite dev server (proxies `/api` to `localhost:5000`)
- `npm run build` — typecheck (`tsc -b`) then production build
- `npm run lint` — ESLint over the whole repo
- `npm run test` — run Vitest (single run: `npm run test -- run`; watch is the default; single file: `npm run test -- path/to/file.test.ts`)
- `npm run preview` — preview the production build locally

There is no separate typecheck-only script; `npm run build` typechecks via `tsc -b` before bundling.

## Architecture

The codebase follows a layered/clean-architecture style under `src/`, with a strict dependency direction: `presentation` → `core` → `infrastructure` → `domain`. `domain` has no dependencies on other layers.

- **`domain/`** — pure types and repository *interfaces* per bounded context (`auth`, `budget`, `finance`, `shared`). No implementation code. Interfaces are named `I<Name>Repository.ts` (e.g. `IBudgetRepository.ts`); data shapes live in `<Name>.types.ts`. `domain/shared/HttpResponse.types.ts` defines the backend's envelope shapes (`HttpResponse<T>`, `PageWrapper<T>`, `PageParams`) used across all repositories.
- **`infrastructure/`** — concrete implementations of the domain interfaces plus cross-cutting plumbing:
  - `repositories/` — one `<Name>RepositoryImpl` class per domain interface, exported as a lowercase singleton instance (e.g. `export const budgetRepository = new BudgetRepositoryImpl()`). These are the only place that call `apiClient` directly and unwrap the `HttpResponse`/`PageWrapper` envelope.
  - `http/apiClient.ts` — the shared Axios instance. Request interceptor injects the Bearer token; response interceptor unwraps `HttpResponse.succeeded`, auto-refreshes the access token on 401 (single retry, via a token-less Axios call to avoid interceptor recursion), and normalizes all errors into a plain `Error` with a Spanish message.
  - `auth/tokenStorage.ts` — thin localStorage wrapper for access/refresh tokens and the cached user.
  - `config/api.config.ts` — `API_CONFIG.BASE_URL` (`/api`).
- **`core/`** — the React Query hook layer (application/use-case layer), one folder per bounded context, calling into the matching `infrastructure/repositories` singleton. Query keys are exported as constants next to their `useQuery` hook (e.g. `SCENARIOS_QUERY_KEY`) so mutation hooks in the same context can `invalidateQueries` against them. Each context folder has an `index.ts` barrel export.
- **`presentation/`**:
  - `router/` — a single `createBrowserRouter` tree in `router/index.tsx`; `ProtectedRoute.tsx` gates authenticated routes by checking `tokenStorage.getAccessToken()` and redirects to `/login`.
  - `components/ui/` — shadcn/ui primitives (do not hand-edit generated visuals beyond what shadcn produces; regenerate via the shadcn CLI when adding new primitives — see `components.json`).
  - `components/shared/` — app-specific shared components (`DataTable`, `ConfirmDialog`, `PageHeader`, `AppLayout`).
  - `features/<name>/{components,pages}` — one folder per feature (`auth`, `budget`, `accounts`, `cost-centers`), pages compose feature components with `core/` hooks.

### Path aliases

`@/*` maps to `src/*` ([vite.config.ts](vite.config.ts), [tsconfig.json](tsconfig.json)). shadcn's `components.json` additionally defines its own aliases pointing into the non-default `presentation/` layout — `@/presentation/components`, `@/presentation/components/ui`, `@/lib`, `@/hooks` — keep these in sync if the directory layout changes, since the shadcn CLI relies on them when scaffolding new `ui/` components.

### Auth flow

Login (`core/auth/useLogin.ts`) calls `authRepository.login`, then stores tokens + user via `tokenStorage`. `useAuth()` reads synchronously from `tokenStorage` (no global auth context/store) — `isAuthenticated` is just `!!accessToken`. On 401, `apiClient`'s response interceptor transparently refreshes and retries once; if refresh fails it clears storage and hard-redirects to `/login`.

### Adding a new domain/feature

Follow the existing `budget` context as the template: `domain/<name>/{<Name>.types.ts, I<Name>Repository.ts}` → `infrastructure/repositories/<Name>Repository.ts` (impl + singleton) → `core/<name>/use*.ts` hooks + `index.ts` barrel → `presentation/features/<name>/{components,pages}`.
