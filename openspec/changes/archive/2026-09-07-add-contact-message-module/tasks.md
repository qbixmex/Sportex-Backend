## 1. Database Migration

- [x] 1.1 Run `bun run migration:generate --name=create_contact_messages_table` and verify a timestamped file is created in `src/database/migrations/`
- [x] 1.2 Review the generated SQL: table `contact_messages` with columns `id`, `name`, `email`, `message`, `read` (default false), `created_at`, `updated_at`; run `bun run migration:run` and verify the table exists in Postgres

## 2. Entity

- [x] 2.1 Create `src/modules/contact-messages/entities/contact-message.entity.ts` matching design.md (snake_case columns, uuid id, `read` default false, `@CreateDateColumn`/`@UpdateDateColumn`) and verify `bun run build` compiles

## 3. DTOs

- [x] 3.1 Create `create-contact-message.dto.ts` (name required min 3, email required `IsEmail`, message required min 8) and `update-contact-message-read.dto.ts` (read required `IsBoolean`); export both through `dto/index.ts`; verify `bun run build` compiles

## 4. Service

- [x] 4.1 Create `contact-messages.service.ts` mirroring `announcements.service.ts` (inject `Repository<ContactMessage>` + `CommonService`) implementing create (forced `read: false`), findAll ordered by `created_at DESC` with `PaginationDto`, findById, updateRead (only the read flag, 404 on missing id), remove; verify `bun run build` compiles
- [x] 4.2 Add `src/modules/contact-messages/contact-messages.service.spec.ts` covering: create starts unread, findAll orders newest first with pagination, findById returns not found for unknown id, updateRead toggles read and rejects unknown id, remove happy path; verify `bun test src/modules/contact-messages/contact-messages.service.spec.ts` passes

## 5. Public Submit Controller

- [x] 5.1 Create `contact-messages.public.controller.ts` at `@Controller('contact-messages')` with `@Version('1')` and NO `@Auth` guard exposing only POST `/` (CreateContactMessageDto); verify `bun run build` compiles and the route is reachable without a JWT

## 6. Admin Management Controller

- [x] 6.1 Create `contact-messages.controller.ts` at `@Controller('contact-messages')` with class-level `@Auth(VALID_ROLES.ADMIN)` and `@Version('1')` on all handlers: GET `/` (PaginationDto), GET `/:id` (ParseUUIDPipe), PATCH `/:id` (UpdateContactMessageReadDto), DELETE `/:id` (ParseUUIDPipe); verify `bun run build` compiles and `bun run lint` is clean

## 7. Module Wiring

- [x] 7.1 Create `contact-messages.module.ts` importing `TypeOrmModule.forFeature([ContactMessage])`, `AuthModule`, `CommonModule`; register `ContactMessagesModule` in `src/app.module.ts`; verify server starts via `bun run start:dev`

## 8. Verification

- [x] 8.1 Run `bun run lint`, `bun test`, `bun run type:check`, and `bun run build` and verify all pass
- [x] 8.2 Smoke-test the full flow with curl: public POST creates a message (unread), admin list returns it newest-first, admin GET by id shows full data, admin PATCH `/:id` with `{ "read": true }` marks read and can revert to unread, admin cannot modify name/email/message (no such route), DELETE removes it and subsequent GET returns 404
