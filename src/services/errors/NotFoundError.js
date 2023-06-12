import CustomError from './CustomErrors.js';

export class NotFoundError extends CustomError {
    constructor(details) {
        super({
            name: 'NotFoundError',
            message: 'Recurso no encontrado.',
            code: 4,
            details
        });
    }
}