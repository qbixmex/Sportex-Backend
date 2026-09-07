## Why

La plataforma necesita mostrar banners promocionales destacados en la portada. Actualmente no existe una forma de gestionar estos banners de héroe, por lo que no se pueden crear, ordenar ni mostrar de manera controlada.

## What Changes

- Crear el módulo de "Hero Banner" que permita gestionar los banners destacados de la portada.
- Permitir registrar un banner con un título único, una descripción y una imagen.
- Cada banner podrá exhibir o no su información superpuesta, y alinearla a la izquierda, centro o derecha.
- Permitir ordenar visualmente los banners mediante una posición y activarlos o desactivarlos.
- Restringir la gestión de banners únicamente a administradores.

## Capabilities

### New Capabilities
- `hero-banner-management`: Gestión de banners destacados de la portada, incluyendo su creación, consulta, actualización, ordenamiento y activación.

### Modified Capabilities
<!-- No existing capabilities change. -->

## Impact

- Se agrega un módulo comparable a los existentes (por ejemplo, patrocinadores) dentro de la plataforma.
- Se registra un nuevo tipo de recurso gestionable con los mismos criterios de acceso restringido que los recursos similares existentes.