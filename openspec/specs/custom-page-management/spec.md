# custom-page-management Specification

## Purpose

Capacidad para que un administrador publique contenido propio mediante páginas personalizadas (por ejemplo "nosotros", "políticas de privacidad", "reglamento", "historia") con su posicionamiento web y sus imágenes asociadas, y para que el público consulte las páginas publicadas.

## Requirements

### Requirement: Registro de una página personalizada

El sistema SHALL permitir a un administrador registrar una página personalizada indicando su **título** y opcionalmente su **enlace permanente** (único y, cuando se indica, con al menos 4 caracteres); cuando el enlace permanente no se indica, el sistema SHALL derivarlo automáticamente del título. La página puede contener de forma opcional su **cuerpo de contenido** (con al menos 8 caracteres), su **posición** para el orden de visualización, su **título de posicionamiento web** (entre 8 y 80 caracteres), su **descripción de posicionamiento web** (entre 4 y 170 caracteres) y su **directiva para buscadores**. La directiva para buscadores SHALL aceptar solo los valores permitidos ("index, follow", "index, nofollow", "noindex, follow", "noindex, nofollow"). Al registrarse, la página SHALL quedar en estado **borrador**.

#### Scenario: Registro exitoso de una página personalizada

- **WHEN** un administrador registra una página con su título y enlace permanente
- **THEN** el sistema crea la página en estado borrador, con fecha de creación de hoy y, si no se indicó, la directiva para buscadores queda en "noindex, nofollow"

#### Scenario: Registro exitoso de una página sin enlace permanente

- **WHEN** un administrador registra una página indicando únicamente su título
- **THEN** el sistema crea la página en estado borrador y deriva el enlace permanente de su título

#### Scenario: Intento de registrar un enlace permanente ya existente

- **WHEN** un administrador intenta registrar una página cuyo enlace permanente ya está registrado
- **THEN** el sistema rechaza la solicitud por duplicidad

#### Scenario: Registro con un título demasiado corto

- **WHEN** un administrador registra una página cuyo título tiene menos de 4 caracteres
- **THEN** el sistema rechaza la solicitud

#### Scenario: Registro con un enlace permanente indicado demasiado corto

- **WHEN** un administrador registra una página cuyo enlace permanente indicado tiene menos de 4 caracteres
- **THEN** el sistema rechaza la solicitud

#### Scenario: Registro con una directiva para buscadores no permitida

- **WHEN** un administrador registra una página con un valor de directiva para buscadores fuera de los permitidos
- **THEN** el sistema rechaza la solicitud

### Requirement: Listado de páginas personalizadas

El sistema SHALL permitir a un administrador obtener la lista de páginas personalizadas, paginada y ordenada por **posición** de forma ascendente y, en caso de empate, por **fecha de creación** mostrando primero las más antiguas.

#### Scenario: Listado paginado y ordenado de las páginas

- **WHEN** un administrador solicita la lista de páginas personalizadas
- **THEN** el sistema devuelve las páginas ordenadas por posición ascendente y, en empate, por fecha de creación de más antiguas a más recientes, en páginas de tamaño definido

### Requirement: Consulta de una página personalizada

El sistema SHALL permitir a un administrador consultar una página personalizada por su identificador y ver todos sus datos: título, enlace permanente, cuerpo de contenido, posición, título y descripción de posicionamiento web, directiva para buscadores, estado, fechas de creación y de actualización, y sus imágenes asociadas.

#### Scenario: Consulta de una página existente

- **WHEN** un administrador consulta una página por su identificador
- **THEN** el sistema devuelve todos los datos de la página incluyendo sus imágenes asociadas

### Requirement: Modificación de una página personalizada

El sistema SHALL permitir a un administrador modificar el título, el cuerpo de contenido, la posición, el título y la descripción de posicionamiento web, la directiva para buscadores y el estado de una página existente. El enlace permanente SHALL mantenerse único en la plataforma. Los cambios SHALL quedar reflejados de inmediato.

#### Scenario: Modificación exitosa de una página

- **WHEN** un administrador modifica el cuerpo de contenido o el estado de una página
- **THEN** el sistema guarda los cambios y los refleja de inmediato

#### Scenario: Modificación que duplica el enlace permanente de otra página

- **WHEN** un administrador modifica una página dejando el enlace permanente de otra página ya registrada
- **THEN** el sistema rechaza la solicitud por duplicidad

### Requirement: Control de estado de una página personalizada

El sistema SHALL permitir a un administrador cambiar el estado de una página entre **borrador**, **en espera**, **no publicada** y **publicada**. Solo una página en estado **publicada** SHALL ser consultable por el público; en cualquier otro estado, la página SHALL NOT ser visible públicamente.

#### Scenario: Publicación de una página

- **WHEN** un administrador cambia el estado de una página a publicada
- **THEN** la página queda consultable por el público mediante su enlace permanente

#### Scenario: Una página no publicada no es visible públicamente

- **WHEN** una página está en estado borrador, en espera o no publicada
- **THEN** el público no puede consultarla

### Requirement: Eliminación de una página personalizada

El sistema SHALL permitir a un administrador eliminar una página personalizada de forma definitiva. Al eliminar la página, el sistema SHALL eliminar también, de forma definitiva, todas sus imágenes asociadas. La eliminación SHALL confirmarse únicamente con un mensaje.

#### Scenario: Eliminación de una página

- **WHEN** un administrador elimina una página existente
- **THEN** la página se elimina de forma definitiva y deja de existir en el sistema, y el sistema responde un mensaje de confirmación

#### Scenario: Eliminación de una página con imágenes

- **WHEN** un administrador elimina una página que tiene imágenes
- **THEN** la página se elimina de forma definitiva y todas sus imágenes se eliminan con ella, y el sistema responde un mensaje de confirmación

### Requirement: Registro de una imagen en una página personalizada

El sistema SHALL permitir a un administrador registrar una imagen dentro de una página existente indicando su **título** (con al menos 4 caracteres) y la **referencia a la imagen** (ubicación e identificador público). Al registrarse, la imagen SHALL quedar asociada obligatoriamente a esa página y con fecha de creación igual al día de su registro.

#### Scenario: Registro exitoso de una imagen en una página

- **WHEN** un administrador registra una imagen con su título y referencia en una página existente
- **THEN** el sistema crea la imagen asociada a esa página, con fecha de creación de hoy

#### Scenario: Registro de una imagen en una página inexistente

- **WHEN** un administrador intenta registrar una imagen en una página que no existe
- **THEN** el sistema rechaza la solicitud

### Requirement: Listado de imágenes de una página personalizada

El sistema SHALL permitir a un administrador obtener la lista de imágenes de una página específica, paginada y ordenada por **fecha de creación** mostrando primero las más antiguas.

#### Scenario: Listado paginado de las imágenes de una página

- **WHEN** un administrador solicita la lista de imágenes de una página
- **THEN** el sistema devuelve las imágenes de esa página ordenadas por fecha de creación, de más antiguas a más recientes, en páginas de tamaño definido

### Requirement: Consulta de una imagen de una página personalizada

El sistema SHALL permitir a un administrador consultar una imagen por su identificador dentro de su página y ver todos sus datos (título, referencia a la imagen, fechas de creación y de actualización) **sin incluir la página a la que pertenece**.

#### Scenario: Consulta de una imagen existente

- **WHEN** un administrador consulta una imagen por su identificador dentro de su página
- **THEN** el sistema devuelve todos los datos de la imagen sin incluir la página

### Requirement: Modificación de una imagen de una página personalizada

El sistema SHALL permitir a un administrador modificar el **título** y la **referencia a la imagen** de una imagen existente. Los cambios SHALL quedar reflejados de inmediato.

#### Scenario: Modificación de una imagen

- **WHEN** un administrador modifica el título o la referencia de una imagen
- **THEN** el sistema guarda los cambios y los refleja de inmediato

### Requirement: Eliminación de una imagen de una página personalizada

El sistema SHALL permitir a un administrador eliminar una imagen de una página de forma definitiva. La eliminación SHALL confirmarse únicamente con un mensaje.

#### Scenario: Eliminación de una imagen

- **WHEN** un administrador elimina una imagen existente
- **THEN** la imagen se elimina de forma definitiva y deja de existir en el sistema, y el sistema responde un mensaje de confirmación

### Requirement: Acceso restringido a administradores de la gestión de páginas e imágenes

El sistema SHALL restringir el acceso a la gestión de páginas personalizadas y de sus imágenes únicamente a usuarios con rol administrador. Los usuarios sin ese rol SHALL ser rechazados.

#### Scenario: Acceso de un administrador

- **WHEN** un usuario administrador intenta acceder a la gestión de páginas o de sus imágenes
- **THEN** el sistema le permite operar con ellas

#### Scenario: Acceso de un usuario no administrador

- **WHEN** un usuario que no es administrador intenta acceder a la gestión de páginas o de sus imágenes
- **THEN** el sistema rechaza la solicitud

### Requirement: Consulta pública de una página publicada

El sistema SHALL permitir a cualquier visitante consultar una página en estado **publicada** mediante su enlace permanente, viendo su título, su cuerpo de contenido, su título y descripción de posicionamiento web y sus imágenes asociadas. Una página que no esté publicada o un enlace permanente inexistente SHALL NOT devolverse.

#### Scenario: Consulta pública de una página publicada

- **WHEN** un visitante solicita una página publicada por su enlace permanente
- **THEN** el sistema devuelve los datos públicos de la página con sus imágenes asociadas

#### Scenario: Consulta pública de una página no publicada

- **WHEN** un visitante solicita una página que está en estado borrador, en espera o no publicada
- **THEN** el sistema rechaza la solicitud

#### Scenario: Consulta pública de un enlace permanente inexistente

- **WHEN** un visitante solicita una página por un enlace permanente que no existe
- **THEN** el sistema rechaza la solicitud

### Requirement: Listado público de páginas publicadas

El sistema SHALL permitir a cualquier visitante obtener la lista de páginas en estado **publicada**, paginada y ordenada por **posición** de forma ascendente y, en caso de empate, por **fecha de creación** mostrando primero las más antiguas. La lista SHALL incluir únicamente datos públicos de cada página (título, enlace permanente, título y descripción de posicionamiento web y su posición).

#### Scenario: Listado público de páginas publicadas

- **WHEN** un visitante solicita la lista de páginas publicadas
- **THEN** el sistema devuelve solo las páginas publicadas, ordenadas por posición ascendente y, en empate, por fecha de creación de más antiguas a más recientes, con sus datos públicos