
export class ObjectNotFound extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InvalidObjectId extends Error {
    public objectType: string;
    public objectId: string;

    constructor(message, objectType: string, objectId: string) {
        super(message)
        
        this.objectId = objectId;
        this.objectType = objectType;

        this.name = this.constructor.name
        
        Error.captureStackTrace(this, this.constructor);
    }
}