import morgan, { token } from "morgan";
import { request, response, type RequestHandler } from "express";
import { ILogger } from "./logger.interface";
import { LogMetaData } from "./logger.type";
import { getRequestID } from "./request-context";

export function createMorganMiddleware(logger: ILogger): RequestHandler {
    return morgan(
        (tokens,request, response) => {
            const path = new URL(request.url ?? "/", "http://localhost").pathname

            const acessLogs: LogMetaData = {
                request: getRequestID(),
                method: tokens.method,
                path,
                statusCode: Number(tokens.status(request,response)),
                responseTimeMs: Number(
                    tokens["response-time"](request, response)
                ),
                contentLength:
                    tokens.res(request, response, "content-length") ??
                    undefined
            }

            return JSON.stringify(acessLogs)
        },

        {
            stream: {
                write(message: string) : void {

                    try {
                        const metadata = JSON.parse(message) as LogMetaData
                        logger.info("http.access", metadata)
                    }catch(err){
                         logger.info("http.access", {
                            raw: message.trim()
                        });
                    }
                }
            }
        }
    )

}