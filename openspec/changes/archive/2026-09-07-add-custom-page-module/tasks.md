## 1. Database Migrations

- [x] 1.1 Run `bun run migration:generate --name=create_custom_pages_table` and verify a timestamped file is created in `src/database/migrations/`
- [x] 1.2 Review the generated SQL: table `custom_pages` with columns `id`, `title`, `permalink` (unique), `content` (nullable), `position` (int NOT NULL DEFAULT 0), `seo_title`, `seo_description`, `seo_robots` (varchar NOT NULL DEFAULT 'noindex, nofollow'), `status` (enum default 'draft'), `created_at`, `updated_at`; run `bun run migration:run` and verify the table exists in Postgres
- [x] 1.3 Run `bun run migration:generate --name=create_custom_page_images_table` and verify a timestamped file is created in `src/database/migrations/`
- [x] 1.4 Review the generated SQL: table `custom_page_images` with columns `id`, `parent_page_id` (FK → `custom_pages.id` ON DELETE CASCADE), `title`, `image_url`, `image_public_id`, `created_at`, `updated_at`; run `bun run migration:run` and verify the table exists in Postgres

## 2. Entities and Enums

- [x] 2.1 Create `src/modules/custom-pages/enums/page-status.enum.ts` with `PAGE_STATUS` const-object (draft, hold, unpublished, published) + `PageStatus` type, mirroring `alignment.enum.ts`, and verify `bun run build` compiles
- [x] 2.2 Create `src/modules/custom-pages/enums/seo-robots.enum.ts` with `SEO_ROBOTS` const-object (the four "index/nofollow" values) + `SeoRobots` type and verify `bun run build` compiles
- [x] 2.3 Create `src/modules/custom-pages/entities/custom-page.entity.ts` per design.md (uuid id, `@BeforeInsert`/`@BeforeUpdate` hooks normalizing `permalink` via `formatPermalinkOrSlug`, `status` DB enum default draft, `seo_robots` varchar default 'noindex, nofollow', `position` int default 0, `@CreateDateColumn`/`@UpdateDateColumn`, `@OneToMany(() => CustomPageImage, (p) => p.parentPage)` `images`) and verify `bun run build` compiles
- [x] 2.4 Create `src/modules/custom-page-images/entities/custom-page-image.entity.ts` per design.md (`@ManyToOne(() => CustomPage, (p) => p.images, { nullable: false, onDelete: 'CASCADE' })` + `@JoinColumn({ name: 'parent_page_id' })`, title, image_url, image_public_id, `@CreateDateColumn`/`@UpdateDateColumn`) and verify `bun run build` compiles

## 3. DTOs

- [x] 3.1 Create `src/modules/custom-pages/dto/create-custom-page.dto.ts` with class-validator fields (title required min 4, permalink optional `IsOptional` min 4 when provided, content optional `IsString` min 8, position optional `IsInt`, seoTitle optional `MinLength(8)` `MaxLength(80)`, seoDescription optional `MinLength(4)` `MaxLength(170)`, seoRobots optional `IsEnum(SEO_ROBOTS)`, status optional `IsEnum(PAGE_STATUS)`), `update-custom-page.dto.ts` via `PartialType`, and `dto/index.ts`; verify `bun run build` compiles
- [x] 3.2 Create `src/modules/custom-page-images/dto/create-custom-page-image.dto.ts` (title required min 4, imageUrl required `IsUrl`, imagePublicId required `IsString` min 4), `update-custom-page-image.dto.ts` via `PartialType`, and `dto/index.ts`; verify `bun run build` compiles

## 4. Custom Pages Service and Tests

- [x] 4.1 Create `src/modules/custom-pages/custom-pages.service.ts` mirroring `galleries.service.ts`/`contact-messages.service.ts` (inject `Repository<CustomPage>` + `CommonService`) implementing: admin findAll (order `position ASC` then `createdAt ASC` with `PaginationDto`), findById (with `relations: { images: true }`), create (default `status` draft and `seoRobots` 'noindex, nofollow' when omitted, duplicate `permalink` via `count()` → `ConflictException`), update (guard duplicate `permalink` excluding self), remove (confirmation message only); public findPublishedAll (only `status` = published, public-field projection, same ordering + pagination) and findPublishedByPermalink (`NotFoundException` when not published or missing); verify `bun run build` compiles
- [x] 4.2 Add `src/modules/custom-pages/custom-pages.service.spec.ts` covering: create defaults to draft/status and seo_robots default, duplicate permalink raises conflict, findById includes images, list orders by position then createdAt, public list only returns published pages, public permalink lookup rejects unpublished/unknown permalinks, remove returns a confirmation message; verify `bun test src/modules/custom-pages/custom-pages.service.spec.ts` passes

## 5. Custom Page Images Service and Tests

- [x] 5.1 Create `src/modules/custom-page-images/custom-page-images.service.ts` mirroring `gallery-images.service.ts` (inject `Repository<CustomPageImage>` + `Repository<CustomPage>` + `CommonService`) implementing: findAll scoped to the page ordered `createdAt ASC` with `PaginationDto`, findById/create/update stripping the `customPage` relation from responses, remove returning a confirmation message, and every operation resolving the parent page first (404 if missing); verify `bun run build` compiles
- [x] 5.2 Add `src/modules/custom-page-images/custom-page-images.service.spec.ts` covering: create associates the image to the page, unknown page raises not found, findAll returns only that page's images ordered by createdAt ASC with pagination, findById/update responses exclude the parent page key, remove returns only a confirmation message; verify `bun test src/modules/custom-page-images/custom-page-images.service.spec.ts` passes

## 6. Controllers

- [x] 6.1 Create `src/modules/custom-pages/custom-pages.controller.ts` at `@Controller('admin/custom-pages')` with class-level `@Auth(VALID_ROLES.ADMIN)` and `@Version('1')` on all handlers: GET `/` (PaginationDto), GET `/:id`, POST `/`, PATCH `/:id`, DELETE `/:id`; `id` via `ParseUUIDPipe`; verify `bun run build` compiles
- [x] 6.2 Create `src/modules/custom-pages/custom-pages.public.controller.ts` at `@Controller('custom-pages')` without `@Auth`, `@Version('1')` on: GET `/` (PaginationDto), GET `/:permalink`; verify `bun run build` compiles and non-published pages are never returned
- [x] 6.3 Create `src/modules/custom-page-images/custom-page-images.controller.ts` at `@Controller('admin/custom-pages/:pageId/images')` with class-level `@Auth(VALID_ROLES.ADMIN)` and `@Version('1')` on all handlers: GET `/` (PaginationDto), GET `/:id`, POST `/`, PATCH `/:id`, DELETE `/:id`; `pageId` and `id` via `ParseUUIDPipe`; verify `bun run build` compiles and `bun run lint` is clean

## 7. Module Wiring

- [x] 7.1 Create `src/modules/custom-pages/custom-pages.module.ts` importing `TypeOrmModule.forFeature([CustomPage])`, `AuthModule`, `CommonModule`; controllers `[CustomPagesController, CustomPagesPublicController]`
- [x] 7.2 Create `src/modules/custom-page-images/custom-page-images.module.ts` importing `TypeOrmModule.forFeature([CustomPageImage, CustomPage])`, `AuthModule`, `CommonModule`
- [x] 7.3 Register `CustomPagesModule` and `CustomPageImagesModule` in `src/app.module.ts`; verify the server starts via `bun run start:dev` and `/api/v1/custom-pages` answers publicly while `/api/v1/admin/custom-pages` answers only to an admin JWT

## 8. Verification

- [x] 8.1 Run `bun run lint`, `bun test`, `bun run type:check`, and `bun run build` and verify all pass
- [x] 8.2 Smoke-test with curl/admin token: create pages (draft default, with/without SEO and content), list ordered by position, publish one via PATCH, create/list/update/delete images for a page, confirm public list only shows published pages and public permalink lookup returns the published page with its images, then delete a page and confirm its images are gone