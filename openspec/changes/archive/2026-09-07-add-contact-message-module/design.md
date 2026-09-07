## Context

NestJS 12 + TypeORM platform with UUID ids, `@Auth(VALID_ROLES.ADMIN)` pattern, versioned `/api/v1` routes, shared `PaginationDto`, snake_case `created_at`/`updated_at`, and no global auth guard (guards are per-controller). Existing feature modules (announcements, videos) follow the same CRUD shape. See proposal.md — Why; the behavior contract lives in `specs/contact-message-management/spec.md`.

## Goals / Non-Goals

**Goals:**
- A self-contained `contact-messages` module with a **public** submit endpoint and an **admin-only** management surface.
- A `ContactMessage` entity with exactly the business fields defined (identifier, name, email, message, read, created/updated dates).
- Content immutability enforced by construction: only the `read` state is updatable; delete is allowed; no content modification path exists.
- New messages start unread (`read = false`), reception date defaults to now.

**Non-Goals:**
- No reply/notification workflow, no read-receipts other than the `read` flag, no spam protection/rate limiting, no association with users/tournaments/teams, no edit of message content, no public listing (list/detail are admin-only).

## Decisions

- **Entity `ContactMessage` in `src/modules/contact-messages/entities/contact-message.entity.ts`**, table name `contact_messages`, `@PrimaryGeneratedColumn('uuid') id`. Columns:

  | Column | Type | Rules |
  |---|---|---|
  | `id` | uuid | PK |
  | `name` | varchar | required |
  | `email` | varchar | required; validated as email |
  | `message` | text | required |
  | `read` | boolean | DB default `false` (`Default(false)`) |
  | `created_at` | timestamptz | `@CreateDateColumn` (reception date) |
  | `updated_at` | timestamptz nullable | `@UpdateDateColumn` |

  Rationale: mirrors the dominant snake_case convention (tournaments/teams/videos) and the entity table passed by the product owner.

- **Two controllers, one module** under `src/modules/contact-messages/`:
  - `contact-messages.module.ts` imports `TypeOrmModule.forFeature([ContactMessage])`, `AuthModule`, `CommonModule`; registered in `app.module.ts`.
  - `contact-messages.controller.ts` at `@Controller('contact-messages')` with class-level `@Auth(VALID_ROLES.ADMIN)` and `@Version('1')` on every admin handler (real paths `/api/v1/contact-messages`): GET `/` (pagination), GET `/:id`, PATCH `/:id` (read-state only, via `UpdateContactMessageReadDto`), DELETE `/:id`. `:id` uses `ParseUUIDPipe`.
  - `public` controller (`contact-messages.public.controller.ts`, no `@Auth`) exposing only POST `/` for form submission. The two-controller split is required because there is no global guard and a class-level `@Auth` on the admin controller would also gate the public submit; a separate controller keeps submission unauthenticated while management stays admin-only. Alternative considered: one controller with `@Public()` methodology — rejected because the codebase has no `@Public` decorator/guard and per-class `@Auth` is the established pattern.

- **Service `contact-messages.service.ts`** mirrors `announcements.service.ts` (`CommonService.handleExceptions`, `NotFoundException`): `create` (ingest; forces `read: false`), `findAll` (ordered by `created_at DESC`, newest first, `page`/`take` from `PaginationDto`), `findById`, `updateRead` (accepts only the `read` state; 404 on missing id), `remove`.

- **DTOs** (`class-validator`, following `create-announcement.dto.ts`): `create-contact-message.dto.ts` → `name` required min 3, `email` required `IsEmail`, `message` required min 8; `update-contact-message-read.dto.ts` → `read` required `IsBoolean`. There is deliberately **no** `UpdateContactMessageDto`/`PartialType` for content — immutability is enforced by having only a read-state DTO. Exported via `dto/index.ts`.

- **Migration:** `bun run migration:generate --name=create_contact_messages_table` (timestamped file in `src/database/migrations/`), applied with `bun run migration:run`. Follows the plural `create_<table>_table` convention.

- **Privacy:** service never logs message content; only the message id is included in error/log output.

## Risks / Trade-offs

- Public, unauthenticated submit endpoint is reachable by bots/spam → out of scope for this change; noted as a future hardening step (rate limiting/CAPTCHA) rather than blocking the module.
- Email stored as plain varchar with only `IsEmail` validation → no uniqueness or verification; acceptable: messages are unsolicited form input and admins act on them manually.
- Ordering newest-first is an assumption for the inbox UX (spec says most recent first) → if product wants oldest-first, it is a one-line `findAll` change; called out in design so it is a conscious decision.
- Two controllers in one module add a small files count → traded off against keeping the public endpoint truly unauthenticated without introducing a new decorator/guard pattern.

## Migration Plan

1. `bun run migration:generate --name=create_contact_messages_table` → inspect generated SQL → `bun run migration:run`.
2. Rollback: `bun run migration:revert` drops the `contact_messages` table (idempotent; standalone data, no dependents).

## Open Questions

None. Behavior is fully covered by `specs/contact-message-management/spec.md`; ordering (newest-first) and the admin-only read toggle were confirmed with the product owner.
