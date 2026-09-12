export const UNAUTHORIZED_ERROR = {
  statusCode: 401,
  message: 'Token no válido',
  error: 'Unauthorized',
};

export const FORBIDDEN_ERROR = {
  statusCode: 403,
  message: 'No estas autorizado para realizar esta acción',
  error: 'Forbidden',
};

export const BAD_REQUEST_UUID_ERROR = {
  statusCode: 400,
  message: 'El identificador proporcionado no es un formato UUID válido',
  error: 'Bad Request',
};

export const BAD_REQUEST_SEARCH_ERROR = {
  statusCode: 400,
  message: [
    'El término de búsqueda debe ser una cadena de texto',
    'page must not be less than 1',
    'take must not be less than 0',
  ],
  error: 'Bad Request',
};

export const BAD_REQUEST_CREATE_ERROR = {
  statusCode: 400,
  message: [
    'El email debe tener un formato válido',
    'La contraseña debe ser igual o mayor a 8 caracteres',
  ],
  error: 'Bad Request',
};

export const NOT_FOUND_ERROR = {
  statusCode: 404,
  message: 'El usuario no existe con el identificador proporcionado',
  error: 'Not Found',
};

export const CONFLICT_ERROR = {
  statusCode: 409,
  message: 'El usuario con el email proporcionado ya existe',
  error: 'Conflict',
};

export const INTERNAL_SERVER_ERROR = {
  statusCode: 500,
  message: 'Error desconocido, revisa los logs para mas información',
  error: 'Internal Server Error',
};