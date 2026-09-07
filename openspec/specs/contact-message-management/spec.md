# contact-message-management Specification

## Purpose

Permite recibir los mensajes que los visitantes envían a través del formulario de contacto de la web y que los administradores puedan gestionarlos internamente: leerlos, controlar cuáles han sido atendidos y eliminarlos.

## Requirements

### Requirement: Envío de un mensaje de contacto

El sistema SHALL permitir a un visitante enviar un mensaje de contacto indicando su nombre, su correo electrónico y el texto del mensaje, que debe contener al menos 8 caracteres. Al recibirse, el mensaje SHALL quedar en estado **no leído** y con su fecha de recepción registrada automáticamente.

#### Scenario: Envío exitoso de un mensaje
- **WHEN** un visitante envía un mensaje de contacto con nombre, correo electrónico y texto
- **THEN** el mensaje queda registrado con fecha de recepción de hoy y en estado **no leído**

#### Scenario: Envío con mensaje demasiado corto
- **WHEN** un visitante envía un mensaje de contacto cuyo texto tiene menos de 8 caracteres
- **THEN** el sistema rechaza el envío y no registra el mensaje

### Requirement: Contenido inmodificable de un mensaje

El sistema SHALL impedir que el contenido de un mensaje de contacto (nombre, correo electrónico y texto) sea modificado después de su envío, por ningún rol.

#### Scenario: Intento de modificar un mensaje recibido
- **WHEN** un administrador intenta modificar el nombre, el correo electrónico o el texto de un mensaje de contacto ya recibido
- **THEN** el sistema rechaza la modificación y el contenido del mensaje permanece intacto

### Requirement: Listado de mensajes de contacto

El sistema SHALL permitir a un administrador obtener la lista de mensajes de contacto recibidos, paginada y ordenada por fecha de recepción, mostrando primero los más recientes.

#### Scenario: Listado paginado de mensajes
- **WHEN** un administrador solicita la lista de mensajes de contacto
- **THEN** el sistema devuelve los mensajes ordenados por fecha de recepción de más recientes a más antiguos, en páginas de tamaño definido

### Requirement: Consulta de un mensaje de contacto

El sistema SHALL permitir a un administrador consultar un mensaje de contacto por su identificador y ver todos sus datos (nombre, correo electrónico, texto, estado leído o no leído, fecha de recepción y fecha de última actualización).

#### Scenario: Consulta de un mensaje existente
- **WHEN** un administrador consulta un mensaje de contacto por su identificador
- **THEN** el sistema devuelve todos los datos del mensaje

### Requirement: Control de lectura de un mensaje

El sistema SHALL permitir a un administrador **marcar** un mensaje de contacto como **leído** y también volverlo al estado **no leído**. El estado de lectura es la única información de un mensaje que un administrador puede modificar. Un cambio de estado SHALL quedar reflejado de inmediato.

#### Scenario: Marcar un mensaje como leído
- **WHEN** un administrador marca como leído un mensaje de contacto no leído
- **THEN** el mensaje queda en estado **leído**

#### Scenario: Volver un mensaje a no leído
- **WHEN** un administrador vuelve al estado no leído un mensaje de contacto leído
- **THEN** el mensaje queda en estado **no leído**

### Requirement: Eliminación de un mensaje de contacto

El sistema SHALL permitir a un administrador eliminar un mensaje de contacto de forma definitiva.

#### Scenario: Eliminación de un mensaje
- **WHEN** un administrador elimina un mensaje de contacto
- **THEN** el mensaje se elimina de forma definitiva y deja de existir en el sistema

### Requirement: Acceso a la gestión restringido a administradores

El sistema SHALL restringir la gestión del buzón de mensajes de contacto (listado, consulta, control de lectura y eliminación) únicamente a usuarios con rol administrador. Los usuarios sin ese rol SHALL ser rechazados. El envío de un mensaje a través del formulario de contacto SHALL estar disponible para cualquier visitante sin necesidad de iniciar sesión.

#### Scenario: Acceso de un administrador a la gestión
- **WHEN** un usuario administrador intenta acceder a la gestión de los mensajes de contacto
- **THEN** el sistema le permite operar con los mensajes

#### Scenario: Acceso de un usuario no administrador a la gestión
- **WHEN** un usuario que no es administrador intenta acceder a la gestión de los mensajes de contacto
- **THEN** el sistema rechaza la solicitud

#### Scenario: Envío de un visitante sin iniciar sesión
- **WHEN** un visitante que no ha iniciado sesión envía un mensaje a través del formulario de contacto
- **THEN** el mensaje se registra correctamente sin exigirle autenticación