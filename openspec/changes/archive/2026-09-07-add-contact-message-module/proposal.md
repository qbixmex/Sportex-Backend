## Why

La plataforma no cuenta con un buzón centralizado para recibir y atender los mensajes que envían los visitantes a través del formulario de contacto de la web. Sin este módulo, esos mensajes no quedan registrados ni pueden ser gestionados desde el sistema, y el equipo pierde el control sobre quién necesita una respuesta o qué mensajes ya fueron atendidos.

## What Changes

- Se incorpora un módulo de **mensajes de contacto** para recibir y gestionar las comunicaciones de los visitantes de la web.
- Un **visitante** envía un mensaje de contacto indicando su nombre, su correo electrónico y el texto del mensaje.
- Un mensaje recién recibido queda en estado **no leído**; su fecha de recepción se registra automáticamente en el momento del envío.
- El contenido de un mensaje enviado por un visitante es **inmodificable**: nombre, correo electrónico y texto no pueden cambiarse después de ser enviados.
- Únicamente los **administradores** gestionan el buzón y pueden:
  - **listar** los mensajes recibidos;
  - **consultar** un mensaje individual y ver todos sus datos;
  - **marcar** un mensaje como leído o volverlo a no leído (es la única información modificable de un mensaje);
  - **eliminar** un mensaje de forma definitiva.

## Capabilities

### New Capabilities

- `contact-message-management`: Recepción de mensajes de contacto enviados por visitantes de la web y su gestión interna por parte de administradores (listado, consulta, control de lectura y eliminación).

### Modified Capabilities

- Ninguna.

## Impact

- Se agrega una nueva unidad de gestión dentro de la plataforma, cuyo uso operativo queda restringido al rol administrador.
- La recepción de mensajes es de acceso público (formulario de contacto), mientras que la gestión del buzón no lo es.
- No se modifican las capacidades existentes de torneos, categorías, equipos, jugadores, entrenadores, canchas, patrocinadores, anuncios, videos, galerías ni banners.
