# hero-banner-management Specification

## Purpose

Permite gestionar los banners destacados de la portada: crear, consultar, modificar, ordenar y activar/desactivar banners con imagen, título y configuración de visualización, restringido a usuarios con rol administrador.

## Requirements

### Requirement: Crear banner destacado

El sistema SHALL permitir crear un banner destacado con un título único, una descripción, una imagen y un identificador público de imagen. El título SHALL no repetirse en el sistema. El banner MAY incluir alineación de datos (izquierda, centro o derecha, por defecto izquierda), bandera de visibilidad de datos (falso por defecto), posición (por defecto 0) y estado activo/inactivo (inactivo por defecto) como datos con valores por defecto.

#### Scenario: Crear banner válido con solo campos obligatorios
- **WHEN** se envía una solicitud de creación con título, descripción, imagen e identificador público de imagen válidos
- **THEN** el sistema crea el banner con alineación izquierda, visibilidad de datos desactivada, posición 0 e inactivo por defecto

#### Scenario: Crear banner con título duplicado
- **WHEN** se intenta crear un banner cuyo título ya está registrado en otro banner
- **THEN** el sistema rechaza la creación y devuelve un error de conflicto

#### Scenario: Crear banner con todos los campos
- **WHEN** se envía una solicitud de creación con título, descripción, imagen, identificador público, alineación, visibilidad de datos, posición y estado activo
- **THEN** el sistema crea el banner con todos los valores indicados

#### Scenario: Crear banner sin título
- **WHEN** se envía una solicitud de creación sin título
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear banner sin descripción
- **WHEN** se envía una solicitud de creación sin descripción
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear banner sin imagen
- **WHEN** se envía una solicitud de creación sin imagen
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Acceso restringido a administradores

El sistema SHALL permitir gestionar banners destacados (crear, consultar, actualizar y eliminar) únicamente a usuarios con rol administrador. Los usuarios sin rol administrador SHALL NOT poder ejecutar estas operaciones.

#### Scenario: Usuario administrador gestiona banners
- **WHEN** un usuario con rol administrador solicita crear, consultar, actualizar o eliminar un banner
- **THEN** el sistema permite la operación

#### Scenario: Usuario sin rol administrador intenta gestionar banners
- **WHEN** un usuario sin rol administrador solicita crear, consultar, actualizar o eliminar un banner
- **THEN** el sistema rechaza la operación y devuelve un error de autorización

### Requirement: Consultar banners

El sistema SHALL permitir listar banners con paginación y obtener un banner individual por su identificador. El listado SHALL devolver los banners por páginas y el detalle SHALL incluir todos los datos del banner.

#### Scenario: Listar banners paginado
- **WHEN** se solicita la lista de banners con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de banners

#### Scenario: Obtener un banner por identificador
- **WHEN** se solicita un banner cuyo identificador existe
- **THEN** el sistema devuelve todos los datos de ese banner

#### Scenario: Obtener un banner inexistente
- **WHEN** se solicita un banner cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar banner destacado

El sistema SHALL permitir modificar los datos de un banner existente, incluyendo su título, descripción, imagen, identificador público de imagen, alineación, visibilidad de datos, posición y estado activo/inactivo. El título SHALL permanecer único entre todos los banners.

#### Scenario: Actualizar título a un valor no usado
- **WHEN** se actualiza el título de un banner existente a un valor válido y no usado por otro banner
- **THEN** el sistema guarda el nuevo título

#### Scenario: Actualizar título a un valor ya usado
- **WHEN** se intenta actualizar el título de un banner a un título ya registrado por otro banner
- **THEN** el sistema rechaza la actualización y devuelve un error de conflicto

#### Scenario: Actualizar campos opcionales de un banner
- **WHEN** se actualizan campos como descripción, imagen, identificador público, alineación, visibilidad de datos, posición o estado activo
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar banner inexistente
- **WHEN** se intenta actualizar un banner cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar banner destacado

El sistema SHALL permitir eliminar un banner existente por su identificador.

#### Scenario: Eliminar un banner existente
- **WHEN** se elimina un banner cuyo identificador existe
- **THEN** el banner se elimina y ya no aparece en el listado

#### Scenario: Eliminar un banner inexistente
- **WHEN** se intenta eliminar un banner cuyo identificador no existe
- **THEN** el sistema devuelve un error de no encontrado