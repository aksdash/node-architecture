import {AsyncLocalStorage} from 'node:async_hooks'
import { randomUUID } from 'node:crypto'

import type { Request, RequestHandler } from 'express'

interface RequestContext {
    requestID : string
}

const requestContext = new AsyncLocalStorage<RequestContext>()
 
export function getRequestID () : string | undefined {
    return requestContext.getStore()?.requestID
}

export function requestHandlerMiddleware(): RequestHandler {
    return(req, res, next) => {
          const requestID = randomUUID();
          requestContext.run({ requestID }, () => {
              res.setHeader("X-Request-ID", requestID);
              next();
          })

    }
}