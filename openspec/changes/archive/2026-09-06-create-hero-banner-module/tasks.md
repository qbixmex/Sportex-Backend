## 1. Migración y entidad

- [x] 1.1 Generar y verificar la migración `create_hero_banners_table` con `bun run migration:generate --name=create_hero_banners_table`; confirmar que crea la tabla `hero_banners` con las columnas `id` (uuid PK), `title` (varchar UNIQUE), `description` (varchar NOT NULL), `imageUrl` (varchar NOT NULL), `imagePublicId` (varchar NOT NULL), `dataAlignment` (enum `['left','center','right']` default `'left'`), `showData` (boolean default `false`), `position` (int default `0`), `active` (boolean default `false`), `created_at` y `updated_at`
- [x] 1.2 Crear `src/modules/hero-banners/entities/hero-banner.entity.ts` con la entidad `HeroBanner` (tabla `hero_banners`) y el enum `Alignment`, mapeando cada columna con sus tipos y valores por defecto; verificar que compila con `bun run build`
- [x] 1.3 Aplicar la migración con `bun run migration:run` y verificar que la tabla existe (p. ej. inspeccionando la base de datos)

## 2. DTOs y servicio

- [x] 2.1 Crear `src/modules/hero-banners/dto/create-hero-banner.dto.ts` (`CreateHeroBannerDto`), `update-hero-banner.dto.ts` (`UpdateHeroBannerDto` extendiendo con `PartialType`) e `index.ts`; con validaciones de `class-validator`: título obligatorio con longitud mínima, descripción e imagen obligatorias, alineación opcional restringida al enum, visibilidad de datos, posición (>= 0) y estado opcionales
- [x] 2.2 Crear `src/modules/hero-banners/hero-banners.service.ts` con `findAll` (pagina con `PaginationDto`), `findById` (lanza `NotFoundException` si no existe), `create` y `update` (lanzan `ConflictException` al duplicar `title` y delegan errores de BD en `CommonService.handleExceptions`), y `remove` (lanza `NotFoundException` si no existe)

## 3. Controlador y módulo

- [x] 3.1 Crear `src/modules/hero-banners/hero-banners.controller.ts` protegido con `@Auth(VALID_ROLES.ADMIN)`, bajo `@Controller('hero-banners')`, con rutas `@Version('1')`: `GET /`, `GET /:id`, `POST /`, `PATCH /:id` y `DELETE /:id`, usando `ParseUUIDPipe` en los `:id`
- [x] 3.2 Crear `src/modules/hero-banners/hero-banners.module.ts` registrando controlador, servicio, `TypeOrmModule.forFeature([HeroBanner])`, `AuthModule` y `CommonModule`, y registrar `HeroBannersModule` en `app.module.ts`

## 4. Verificación

- [x] 4.1 Ejecutar `bun run lint` y `bun run build` y confirmar que no hay errores de estilo ni de compilación
- [x] 4.2 Verificar los escenarios de la especificación contra la API (con usuario administrador: crear, listar, obtener, actualizar y eliminar un banner; con usuario sin rol administrador: recibir error de autorización; título duplicado: error de conflicto; banner inexistente: error de no encontrado)