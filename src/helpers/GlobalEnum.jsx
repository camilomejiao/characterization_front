
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
    SUPER_ADMIN: 1,
    ADMIN: 2,
    PQRS: 3,
    AFFILIATES: 4,
    AUDITOR: 5,
    CENSALES: 6
}

export const PqrsStatusEnum = {
    OPENED: 1,
    IN_FOLLOW_UP: 2,
    CLOSED: 3
}

export const DefaultsSelectUserFormEnum = {
    country: 43,
    department: 25,
    municipality: 526,
    ethnicity: 1,
    disability_type: 1,
    identification_type: 2
};

export const RegimenEnum = {
    SUB: 1,
    CONT: 2,
    ESP: 3
}