## Why

La plataforma no cuenta con la posibilidad de que un administrador publique contenido propio más allá de los módulos existentes (galerías, videos, anuncios). Se necesita que el administrador pueda crear **páginas personalizadas** de contenido (por ejemplo "nosotros", "políticas de privacidad", "reglamento", "historia") con un editor visual, y que cada página pueda incluir **imágenes**.

## What Changes

- Se incorporan las **páginas personalizadas** como contenido propio de la plataforma.
- Cada página personalizada se define por su **título** y opcionalmente su **enlace permanente** (único y derivado del título cuando no se indica), y puede contener un **cuerpo de contenido** (opcional).
- Cada página puede tener un conjunto de **imágenes** asociadas; cada imagen pertenece obligatoriamente a una única página.
- Cada página indica una **posición** (opcional) para controlar el orden de visualización en el listado, de forma ascendente.
- Cada página puede configurar datos de **posicionamiento web (SEO)**: un título de SEO, una descripción de SEO (ambos opcionales y con longitud acotada) y una **directiva para buscadores** (robots), cuyo valor por omisión es no indexar ni seguir ("noindex, no follow").
- Cada página tiene un **estado** entre: borrador, en espera, no publicada y publicada; por omisión queda en **borrador**.
- Una página **publicada** puede ser consultada por el público mediante su enlace permanente, mostrando su contenido y sus imágenes.
- Un administrador puede **registrar**, **listar**, **consultar**, **modificar** y **eliminar** páginas, así como gestionar las **imágenes** de cada página (registrar, listar, consultar, modificar y eliminar).
- Cuando se **elimina una página**, se eliminan de forma definitiva todas sus imágenes.
- Las respuestas de imágenes muestran únicamente los datos de la imagen, sin incluir la página a la que pertenece; las eliminaciones devuelven solo un mensaje de confirmación.
- No se maneja la subida del archivo de la imagen: el administrador registra una referencia a una imagen ya almacenada por fuera.

## Capabilities

### New Capabilities

- `custom-page-management`: Gestión de páginas personalizadas de contenido: registro, listado, consulta, modificación y eliminación por parte de administradores; control de estado (borrador, en espera, no publicada, publicada), posicionamiento web (SEO) y orden de visualización; gestión de las imágenes asociadas a cada página, y consulta pública de las páginas publicadas por su enlace permanente.

### Modified Capabilities

- Ninguna.

## Impact

- Se agrega una capacidad nueva de gestión de páginas personalizadas (con sus imágenes), sin modificar capacidades existentes.
- La eliminación de una página elimina también sus imágenes.
- Se añade un punto de consulta pública de páginas publicadas para el frontend.
- No se modifican las capacidades de torneos, categorías, equipos, jugadores, entrenadores, canchas, patrocinadores, anuncios, videos ni galerías.
- La gestión (registro, modificación, eliminación) de páginas e imágenes queda restringida a administradores.
