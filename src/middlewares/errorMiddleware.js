export function errorMiddleware(err, req, res, next) {
    if (err instanceof CustomError) {
        res.status(err.code).json({
            error: err.name,
            message: err.message,
            details: err.details
        });
    } else {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.'
        });
    }
}