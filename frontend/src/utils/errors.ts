import { AxiosError } from "axios";
import { ZodError } from "zod";
import { fromError } from 'zod-validation-error';

type ErrorName =
    | 'URL_ERROR'
    | 'DISTANCE_ERROR'
    | 'SERVER_ERROR'
    | 'VALUE_ERROR'

interface IDOPCError {
    name: ErrorName;
    message: string;    
}

export class DOPCError extends Error {
    name: ErrorName;
    message: string;

    constructor({ name, message }: IDOPCError) {
        super();
        this.message = message;
        this.name = name;
    } 
}

export const ServiceErrorHandler = (error: unknown): DOPCError => {
    let obj: IDOPCError = { name: 'SERVER_ERROR', message:'Unexpected error'}
    
    if (error instanceof AxiosError) {
        if (error.status == 404) 
            obj = {name: "URL_ERROR", message: 'Unable to locate resource.'}
        else
            obj.message = error.message
    }
    if (error instanceof ZodError) {
        obj.message = fromError(error).toString()
    }
    return new DOPCError(obj)
}

export const ValueErrorHandler = (error: unknown): DOPCError => {
    if (error instanceof DOPCError)
        return error;
    
    const newError = new DOPCError({ name: 'VALUE_ERROR', message: 'An unexpected error occured.' })
    
    if (error instanceof ZodError) 
        newError.message = fromError(error).toString()
    else if (error instanceof Error)
        newError.message = error.message
        
    return newError;
}