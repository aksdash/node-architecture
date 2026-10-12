import winston from 'winston'
import { getRequestID } from "./request-context";

export const requestContextFormat = winston.format(info => 
    {
        const requestId = getRequestID()
        if (requestId){
            info.requestId = requestId
        }
        return info
    })

