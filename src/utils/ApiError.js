export class ApiError extends Error {
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;
        this.data = null;

        stack ? this.stack = stack : Error.captureStackTrace(this, this.constructor);


    }
}