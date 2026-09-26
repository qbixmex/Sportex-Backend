# AGENTS.md

NestJS 12 + TypeORM sports platform. Bun is the package manager.

## Commands

```bash
bun install         # install deps (use bun, not npm/yarn)
bun run start:dev   # dev server (watch)
bun test            # unit tests (jest, rootDir=src, *.spec.ts)
bun run test:e2e    # e2e (rootDir=test, *.e2e-spec.ts); requires a running DB
bun run lint        # eslint with autofix (typescript-eslint recommendedTypeChecked)
bun run build       # nest build -> dist/
```

- Run a single unit test: `bun test <path/to/file.spec.ts>`.
- Lint/format heaviness: `format` uses prettier; `lint:fix` and `prettier` `endOfLine:"auto"` is enforced by eslint.

## Database (TypeORM, NOT Prisma)

The README's Prisma commands are **stale** — ignore them. This project uses TypeORM.

```bash
docker compose -p sportex up -d   # Postgres 16.4 via docker-compose.yml (uses .env DB_* vars)
bun run migration:generate --name=<name>   # generates into src/database/migrations/<timestamp>-<name>.ts
bun run migration:run        # apply pending migrations
bun run migration:revert     # revert last migration
```

- Migration data source: `src/database/data-source.ts` (`--esm --timestamp` are baked into the script).
- Entities live in `src/**/entities/*.entity.ts`; `autoLoadEntities` is on for the app DataSource, but `data-source.ts` for migrations globs `src/**/entities/*.entity.ts`.
- `synchronize: false` — always use migrations to change schema (see existing ones for the pattern, e.g. join table `create_category_tournament_table.ts`).

## Environment

`.env` is gitignored; copy `.env.template` and fill it. Required vars: `PORT`, `DEFAULT_LIMIT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `AUTH_SECRET`.

- Types are declared in `environment.d.ts` (keep in sync when adding vars).
- `AUTH_SECRET` seeds the JWT signing secret (see `auth/strategies/jwt.strategy.ts`). Generate: `openssl rand -base64 32`.
- Config is loaded via `src/config/env.config.ts` with `ConfigModule.forRoot({ load: [envConfiguration] })`.

## Spec-Driven Development (OpenSpec)

Uses the OpenSpec workflow (`schema: spec-driven`) for spec-first development.

- `openspec/specs/` is the source of truth (one `spec.md` per capability/domain).
- `openspec/changes/` holds proposed changes (delta specs: `proposal.md`, `specs/<capability>/spec.md`, `design.md`, `tasks.md`); archived ones move to `changes/archive/`.
- Work the cycle via the installed skills in `.agents/skills/openspec-*` (`openspec-propose` → `openspec-apply-change` → `openspec-sync-specs` → `openspec-archive-change`). There are no `/opsx:*` slash commands in opencode.
- Useful CLI: `openspec new change "<name>"`, `openspec status`, `openspec validate`, `openspec instructions <artifact> --change "<name>"`.
- `openspec/` (and `.agents/skills/`) must be versioned — they are the source of truth.
- Project context for generated artifacts lives in `openspec/config.yaml` (`context:` field). Keep it in **business language** (see the rules there) — do NOT copy the technical content of this AGENTS.md into it.

## Architecture

- Global prefix `api` + URI versioning: every controller route uses `@Version('1')` → real paths are `/api/v1/...`.
- Only `UserController` is gated by `ApiKeyMiddleware` (registered in `app.module.ts`). Most controllers use the `@Auth(role)` decorator + JWT guards from `src/auth/`.
- Modules per feature in `src/` (e.g. `users/`, `tournaments/`, `categories/`, `auth/`, `common/`).
- `src/common/dto/pagination.dto.ts` is the shared pagination DTO with `DEFAULT_LIMIT`.
- Global `ValidationPipe` is applied in `main.ts`. Responses are **not** wrapped: services return raw data and the HTTP status (`res.ok`/`res.status`) carries the status code. Custom `message` fields returned by services (e.g. create/update/delete) are part of the contract.
- `public/` is served statically via `@nestjs/serve-static`.
- Path aliases: `@/*` → `src/*`, `~/*` → repo root.

## Conventions & gotchas

- Controllers use `ParseUUIDPipe` on all `:id` params (ids are UUIDs).
- Migrations use timestamped files (not incremental numbering) created via the generate script, named `create_<table>_table` with the table name in plural (e.g. `create_players_table`, `create_sponsors_table`, `create_announcements_table`; join tables use the singular join-table name: `create_category_tournament_table`).
- `bun test` fails to start without a reachable Postgres for anything touching TypeORM; DB connection errors are common when `.env` is missing.
