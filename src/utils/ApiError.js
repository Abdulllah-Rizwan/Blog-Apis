export class ApiError extends Error {
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
        this.statusCode = statusCode;
        this.message = message;
        super(message);
        this.errors = errors;
        this.success = false;
        this.data = null;

        stack ? this.stack = stack : Error.captureStackTrace(this, this.constructor);


    }
}