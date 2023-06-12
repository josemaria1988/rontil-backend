import CustomError from './CustomErrors.js';

export class RoutingError extends CustomError {
    constructor(details) {
        super({
            name: 'RoutingError',
            message: 'An error occurred during routing.',
            code: 1,
            details
        });
    }
}