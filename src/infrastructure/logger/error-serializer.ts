export interface SerializableError {
    name : string,
    message : string,
    stack? : string
}

export function serializeError(error: Error) : SerializableError{

    return {
        name : error.name,
        message: error.message,
        stack: error.stack
    }
}