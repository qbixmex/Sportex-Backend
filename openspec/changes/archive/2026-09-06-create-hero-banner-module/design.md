## Context

La plataforma gestiona recursos similares (por ejemplo, patrocinadores) mediante módulos por característica en `src/modules/`, cada uno con su entidad, DTOs, servicio, controlador y módulo, protegido por el decorador de autenticación con rol administrador y versión de ruta `v1`. El esquema evoluciona mediante migraciones de TypeORM con `synchronize: false`. El nuevo módulo de banners destacados replica este patrón establecido.

## Goals / Non-Goals

**Goals:**
- Seguir el mismo patrón de módulo que los recursos existentes (patrocinadores, anuncios) para mantener consistencia.
- Modelar la entidad con los campos y valores por defecto indicados en el proposal en lenguaje de negocio.
- Garantizar la unicidad del título y el acceso restringido a administradores.

**Non-Goals:**
- No se diseña aquí la visualización pública de los banners en la portada (endpoint público de lectura), solo su gestión administrativa (CRUD). Si la portada la requiere, se aborda en un cambio posterior.
- No se integra el subir archivos de imagen a un proveedor de nube; la gestión solo guarda la URL y el identificador público de la imagen (mismo enfoque que patrocinadores).

## Decisions

- **Estructura del módulo**: Se crea `src/modules/hero-banners/` con `entities/hero-banner.entity.ts`, `dto/` (create, update, index), `hero-banners.service.ts`, `hero-banners.controller.ts` y `hero-banners.module.ts`. Se registra el módulo en `app.module.ts`. Alternativa: colocar la entidad y lógica en otro módulo existente; se descarta por claridad y aislamiento de la feature.
- **Tabla y columnas**: Tabla `hero_banners`. Columnas `id` (uuid), `title` (varchar, UNIQUE), `description` (varchar, NOT NULL), `imageUrl` (varchar, NOT NULL), `imagePublicId` (varchar, NOT NULL), `dataAlignment` (enum `['left','center','right']`, default `'left'`), `showData` (boolean, default `false`), `position` (int, default `0`), `active` (boolean, default `false`), `created_at` y `updated_at` (timestamps automáticos). Los nombres de columna se escriben en camelCase para los campos de imagen/alineación, igual que en la entidad de patrocinadores (`imageUrl`, `imagePublicId`).
- **Enum de alineación**: Se define un enum `Alignment` (`left`, `center`, `right`) usado tanto en la entidad como en el DTO de validación para tipar y validar el valor. Alternativa: cadena libre validada; se descarta por seguridad de tipo y validación estricta.
- **DTOs 1:1 con el patrón existente**: `CreateHeroBannerDto` con validaciones de `class-validator` (título obligatorio y mínimo de caracteres, descripción e imagen obligatorias, alineación opcional con valores del enum, visibilidad de datos, posición y estado opcionales). `UpdateHeroBannerDto` extiende el create con `PartialType`.
- **Lógica de negocio (servicio)**: `findAll` con paginación vía `PaginationDto`, `findById` con `NotFoundException`, `create` y `update` con control de unicidad de `title` (`ConflictException`) y delegación de errores de base de datos a `CommonService.handleExceptions`. `remove` con `NotFoundException`. Mismo comportamiento que `SponsorsService`.
- **Controlador**: Protegido con `@Auth(VALID_ROLES.ADMIN)` y rutas versionadas `@Version('1')` bajo `/api/v1/hero-banners`. Uso de `ParseUUIDPipe` en los parámetros `:id`. Alternativa: otro rol o acceso público; se descarta porque la gestión de contenido destacado debe estar restringida a administradores, consistente con los recursos análogos.
- **Migración**: Se genera `create_hero_banners_table.ts` con el script de migraciones; se agrega también el enum `hero_banners_dataAlignment_enum` en PostgreSQL según el patrón estándar de TypeORM para columnas enum.

## Risks / Trade-offs

- [Unicidad de título] El control de duplicados se hace en el servicio y además con la restricción `UNIQUE` en base de datos; ante una carrera se captura el error de unicidad y se traduce a `ConflictException` mediante `handleExceptions`.
- [Enum de alineación en PostgreSQL] Los valores del enum se fijan en migración y solo se pueden extender con un `ALTER TYPE` futuro; se acota a los tres valores del negocio para evitar cambios costosos.
- [Nombres de columna mixtos] Se mezclan nombres camelCase (imagen/alineación) con snake_case (timestamps), siguiendo la convención ya usada en patrocinadores; esto mantiene consistencia con el código existente aunque no sea uniforme.

## Migration Plan

- Generar y aplicar la migración `create_hero_banners_table` con `bun run migration:generate`/`migration:run`.
- Rollback: `migration:revert` elimina la tabla y el enum creados.