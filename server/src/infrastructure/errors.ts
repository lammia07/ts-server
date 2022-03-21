// StatusCode 400
export class BadRequestError extends Error {
    public constructor(message: string = 'BadRequest') {
        super(message);
    }
}

// StatusCode 401
export class UnauthorizedError extends Error {
    public constructor(message: string = 'Unauthorized') {
        super(message);
    }
}

// StatusCode 403
export class ForbiddenError extends Error {
    public constructor(message: string = 'Forbidden') {
        super(message);
    }
}

// StatusCode 404
export class NotFoundError extends Error {
    public constructor(message: string = 'Not Found') {
        super(message);
    }
}
