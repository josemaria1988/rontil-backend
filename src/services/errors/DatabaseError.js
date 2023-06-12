import CustomError from './CustomErrors.js'

export class DatabaseError extends CustomError {
    constructor(details) {
        super({
            name: 'DatabaseError',
            message: 'An error occurred with the database.',
            code: 3,
            details
        });
    }
}