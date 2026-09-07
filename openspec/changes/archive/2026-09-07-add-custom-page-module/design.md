## Context

The codebase already models parent→child content with images and permalinks:
- `Gallery` (table `galleries`) + `GalleryImage` (table `gallery_images`) is the exact parent/child blueprint: admin-only nested CRUD at `/api/v1/galleries/:galleryId/images`, uuid ids, snake_case `created_at`/`updated_at`, `ON DELETE CASCADE` FK, `PaginationDto`, response stripping of the parent object, confirmation-message deletes.
- `Gallery`/`Announcement` already implement the unique `permalink` + `@BeforeInsert`/`@BeforeUpdate` normalization via `formatPermalinkOrSlug` (`src/utils/format_permalink.util.ts`).
- `HeroBanner` already uses a Postgres enum column (`ALIGNMENT` via `enums/alignment.enum.ts`) — the pattern for `status`.
- Media references are stored as `image_url` + `image_public_id` (metadata only; no file upload) in `Announcement`, `HeroBanner`, `GalleryImage`.

See `proposal.md` — Why; the behavior contract lives in `specs/custom-page-management/spec.md`. This change adds a new capability `custom-page-management` — admin-managed content pages (e.g. "nosotros", "políticas de privacidad") with SEO metadata, a publish workflow, public reads, and per-page images (OneToMany/ManyToOne).

## Goals / Non-Goals

**Goals:**
- `custom_pages` and `custom_page_images` tables with `CustomPage` and `CustomPageImage` entities, related OneToMany / ManyToOne.
- Admin CRUD for pages (title, unique permalink, optional content/position/SEO, status workflow) and nested admin CRUD for their images.
- Public read endpoints: list published pages and view a published page by permalink (only `status = published` resolves).
- Metadata-only images: no file upload handling.
- Deleting a page deletes its images via the DB FK.

**Non-Goals:**
- No file upload / storage-service integration (image URL + public id are provided directly by the admin).
- No WYSIWYG editor, no draft/version history, no scheduling — the four statuses are plain values an admin sets.
- No association with tournaments/categories/teams/etc.

## Decisions

- **Entity `CustomPage`** in `src/modules/custom-pages/entities/custom-page.entity.ts`, table `custom_pages`:

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK, `@PrimaryGeneratedColumn('uuid')` (platform-wide convention) |
| `title` | varchar | required (DTO min 4) |
| `permalink` | varchar | optional (DTO min 4 when provided); when omitted, derived from `title` by the hooks; **unique**, normalized by `formatPermalinkOrSlug` hooks |
| `content` | text | nullable (DTO min 8 when present) |
| `position` | int | DB default `0`; used to order listings (ascending) |
| `seo_title` | varchar(80) | nullable (DTO min 8, max 80) |
| `seo_description` | varchar(170) | nullable (DTO min 4, max 170) |
| `seo_robots` | varchar | DB default `'noindex, nofollow'`; allowed values constrained by the `SEO_ROBOTS` TS enum on the DTO |
| `status` | varchar enum | DB `enum` (`PAGE_STATUS`), default `'draft'` |
| `created_at` | timestamptz | `@CreateDateColumn` |
| `updated_at` | timestamptz nullable | `@UpdateDateColumn` |

  - The user table specifies `status` as an enum and `seo_robots` as varchar (the four "index/nofollow" values are enum-like). Following the request literally: `status` becomes a real Postgres `enum` (mirrors `hero_banners.data_alignment`), while `seo_robots` stays a `varchar` column whose valid set is enforced by the `SEO_ROBOTS` const-object + `@IsEnum` on the DTO. Alternative considered: DB enum for `seo_robots` too — rejected because the requested type is explicitly varchar.
  - `permalink` is **optional** on create (mirrors `Gallery`); the `@BeforeInsert`/`@BeforeUpdate` hooks derive it from the title when omitted — `formatPermalinkOrSlug(this.permalink ?? this.title)` — and always normalize it (lowercase, dashes, strips accents) so the unique constraint operates on the canonical form. The service re-derives and uniquifies an explicitly provided permalink before persisting.

- **Enums** — const-objects mirroring `src/modules/hero-banners/enums/alignment.enum.ts`:
  - `src/modules/custom-pages/enums/page-status.enum.ts`: `PAGE_STATUS = { DRAFT: 'draft', HOLD: 'hold', UNPUBLISHED: 'unpublished', PUBLISHED: 'published' }` + `PageStatus` type.
  - `src/modules/custom-pages/enums/seo-robots.enum.ts`: `SEO_ROBOTS = { INDEX_FOLLOW: 'index, follow', INDEX_NOFOLLOW: 'index, nofollow', NOINDEX_FOLLOW: 'noindex, follow', NOINDEX_NOFOLLOW: 'noindex, nofollow' }` + `SeoRobots` type.

- **Entity `CustomPageImage`** in `src/modules/custom-page-images/entities/custom-page-image.entity.ts`, table `custom_page_images`:

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK, `@PrimaryGeneratedColumn('uuid')` |
| `parent_page_id` | uuid | FK → `custom_pages.id`; `@ManyToOne(() => CustomPage, (p) => p.images, { nullable: false, onDelete: 'CASCADE' })` + `@JoinColumn({ name: 'parent_page_id' })` |
| `title` | varchar | required (DTO min 4); the child carries its own title |
| `image_url` | varchar | required |
| `image_public_id` | varchar | required |
| `created_at` | timestamptz | `@CreateDateColumn` |
| `updated_at` | timestamptz nullable | `@UpdateDateColumn` |

  Rationale: separate child entity (per "los modelos están separados"), keyed like `GalleryImage` — surrogate uuid PK, FK with `ON DELETE CASCADE`. `image_url` is deliberately **not** unique: the request does not forbid reusing the same image across different content pages (unlike `gallery_images`, where product rules made it unique). The ManyToOne side lives on the child and the `@OneToMany(() => CustomPageImage, (p) => p.parentPage) images` goes on `CustomPage`, importing the child class as a value (mirrors the `gallery`↔`gallery-images` split; a type-only import fails here because the `@OneToMany` callback returns the class as a value — `gallery.entity.ts` uses the same runtime import).

- **Module layout** mirrors the `galleries` + `gallery-images` split:
  - `src/modules/custom-pages/`: `custom-pages.module.ts` (`TypeOrmModule.forFeature([CustomPage])`, `AuthModule`, `CommonModule`), `custom-pages.controller.ts` (admin), `custom-pages.public.controller.ts` (public), `custom-pages.service.ts`, `custom-pages.service.spec.ts`, `entities/custom-page.entity.ts`, `enums/`, `dto/create-custom-page.dto.ts`, `dto/update-custom-page.dto.ts` (`PartialType`), `dto/index.ts`.
  - `src/modules/custom-page-images/`: `custom-page-images.module.ts` (`TypeOrmModule.forFeature([CustomPageImage, CustomPage])`, `AuthModule`, `CommonModule`), `custom-page-images.controller.ts`, `custom-page-images.service.ts`, `custom-page-images.service.spec.ts`, `entities/custom-page-image.entity.ts`, `dto/`.
  - Both modules registered in `src/app.module.ts`.

- **Routing — public prefix vs admin prefix.** Two controllers on the *same* base path would collide: the admin list (`GET /custom-pages` — all pages) and the public list (`GET /custom-pages` — only published) cannot both own `GET /` with URI versioning, and `:id` (uuid) vs `:permalink` (slug) dynamic segments would be fragile to registration order. Chosen split:
  - Public (`CustomPagesPublicController`, no `@Auth`) at `@Controller('custom-pages')`, every handler `@Version('1')`: `GET /` (list published → `PaginationDto`), `GET /:permalink` (view published).
  - Admin (`CustomPagesController`, class `@Auth(VALID_ROLES.ADMIN)`) at `@Controller('admin/custom-pages')`, every handler `@Version('1')`: `GET /` (list all), `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`; `:id` via `ParseUUIDPipe`.
  - Images (admin only, `CustomPageImagesController`) at `@Controller('admin/custom-pages/:pageId/images')`, class `@Auth(VALID_ROLES.ADMIN)`: `GET /` (PaginationDto), `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`; `pageId` and `id` via `ParseUUIDPipe`.
  - Traffic is therefore disjoint (`/api/v1/custom-pages` public, `/api/v1/admin/custom-pages...` admin), with no route-ordering hazards. No existing module uses an `/admin` prefix today, so this is a new convention introduced deliberately because this is the first resource needing both an admin list and a public list on the same resource.

- **Services** mirror the existing patterns:
  - `CustomPagesService` (single service for both public and admin, like `ContactMessagesService`): inject `Repository<CustomPage>` + `CommonService`.
    - Admin: `findAll` ordered `position ASC` then `createdAt ASC`, `PaginationDto`; `findById` returns the page **with** `relations: { images: true }` (the spec exposes the page's images); `create` defaults `status` to `PAGE_STATUS.DRAFT` and `seoRobots` to `'noindex, nofollow'` when omitted, duplicate `permalink` → `ConflictException`; `update` guards the unique `permalink` (exclude self) → `ConflictException`; `remove` returns only a confirmation message (DB cascade drops images).
    - Public: `findPublishedByPermalink` → `findOne({ where: { permalink, status: PUBLISHED }, relations: { images: true } })`, `NotFoundException` otherwise; `findPublishedAll` filters `status = PUBLISHED`, orders `position ASC` then `createdAt ASC`, paginates, and projects only the public fields (title, permalink, position, `seo_title`, `seo_description`).
  - `CustomPageImagesService` mirrors `GalleryImagesService` exactly: inject `Repository<CustomPageImage>` + `Repository<CustomPage>` + `CommonService`; every operation resolves the parent page first (404 if missing); `findAll` scoped to the page ordered `createdAt ASC` (oldest first — per the accepted spec); `findById`/`create`/`update` strip the `parentPage` key from responses (plain-object filter, as `GalleryImagesService.stripGallery` does); `remove` returns only a confirmation message.

- **DTOs** use `class-validator`, Spanish messages, and follow the existing DTO style:
  - `CreateCustomPageDto`: `title` `@IsString @IsNotEmpty @MinLength(4)`; `permalink` `@IsString @IsOptional @MinLength(4)`; `content` `@IsString @IsOptional @MinLength(8)`; `position` `@IsInt @IsOptional`; `seoTitle` `@IsString @IsOptional @MinLength(8) @MaxLength(80)`; `seoDescription` `@IsString @IsOptional @MinLength(4) @MaxLength(170)`; `seoRobots` `@IsEnum(SEO_ROBOTS) @IsOptional`; `status` `@IsEnum(PAGE_STATUS) @IsOptional`. `UpdateCustomPageDto = PartialType(CreateCustomPageDto)`.
  - `CreateCustomPageImageDto`: `title` required min 4, `imageUrl` required `@IsUrl`, `imagePublicId` required `@IsString @MinLength(4)`. `UpdateCustomPageImageDto = PartialType(...)`.

- **Migrations** (via `bun run migration:generate`, timestamped, plural table names per convention):
  - `create_custom_pages_table` → `custom_pages` with unique `permalink`, `position int NOT NULL DEFAULT 0`, `seo_robots varchar NOT NULL DEFAULT 'noindex, nofollow'` (nullable=false since it always has a default), `status` enum default `'draft'`, `created_at`/`updated_at`.
  - `create_custom_page_images_table` → `custom_page_images` with FK `parent_page_id` → `custom_pages.id` ON DELETE CASCADE, `title`, `image_url`, `image_public_id`, `created_at`/`updated_at`.
  - Note: the two generated migrations each depend on the entity reflecting `naming-strategy`-driven column names as written above (as with `create_gallery_image_table`).

## Risks / Trade-offs

- Route collision if someone later adds a public route that matches an admin segment → the `admin` prefix keeps the two trees fully disjoint; documented in Decisions so nobody merges them blindly.
- Duplicate `permalink` on create/update → reuse the existing conflict-count pattern; unique DB constraint is the backstop.
- Public reads depend on the stored status value matching `PAGE_STATUS.PUBLISHED` → enforced via the same enum at DTO/DB layers; a stale enum member simply means the page never becomes public.
- TypeORM `@OneToMany` across modules requires `CustomPage` to reference `CustomPageImage` → use the same runtime import `gallery.entity.ts` uses (a type-only import is rejected by the compiler because the relation callback needs the class value).
- Deleting a page silently removes its images → intentional per the spec; the FK `ON DELETE CASCADE` guarantees consistency.

## Migration Plan

1. `bun run migration:generate --name=create_custom_pages_table` → inspect generated SQL (unique `permalink`, `status` enum default `'draft'`, `seo_robots` default `'noindex, nofollow'`, `position` default `0`) → `bun run migration:run`.
2. `bun run migration:generate --name=create_custom_page_images_table` → inspect generated SQL (FK `ON DELETE CASCADE`) → `bun run migration:run`.
3. Rollback: `bun run migration:revert` (in reverse order) drops both tables; nothing else is touched.

## Open Questions

None. Routing (public vs admin prefixes), the varchar-constrained `seo_robots`, non-unique `image_url`, and the four statuses were decided from the request; the SPEC contract is unchanged by any of them.