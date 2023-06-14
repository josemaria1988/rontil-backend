import CustomError from './CustomErrors.js'

export class DatabaseError extends CustomError {
    constructor(name, message, details) {
        super({
            name,
            message,
            code: 3,
            details
        });
    }
}