import CustomError from './CustomErrors.js';

export class InvalidTypeError extends CustomError {
    constructor(details) {
        super({
            name: 'InvalidTypeError',
            message: 'Invalid type for one or more parameters.',
            code: 2,
            details
        });
    }
}