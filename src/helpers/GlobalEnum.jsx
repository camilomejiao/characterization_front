
export const ResponseStatusEnum = {
    OK: 200,
    CREATE: 201,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    Unprocessable: 422,
    INTERNAL_SERVER_ERROR: 500,
}

export const RolesEnum = {
    ADMIN: 1,
    SUPPLIER: 2,
}

export const PqrsStatusEnum = {
    OPENED: 1,
    IN_FOLLOW_UP: 2,
    CLOSED: 3
}

export const DefaultsSelectEnum = {
    country: 43,
    department: 25,
    municipality: 526,
};

export const RegimenEnum = {
    SUB: 1,
    CONT: 2,
    ESP: 3
}