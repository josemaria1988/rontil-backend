class CustomError extends Error {
    constructor({name="Error", cause, message, code=1, details=null}) {
        super(message);
        this.name=name;
        this.code=code;
        this.details=details;
        if (cause) {
            this.cause = cause;
        }
    }
}

export default CustomError