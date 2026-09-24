import winston from "winston"
import { ILogger } from "./logger.interface"
import { LogMetaData } from "./logger.type"

export class WinstonLogger implements ILogger {
    private readonly logger : winston.Logger

    constructor(){
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console()
            ]
        })
    }

    info(message: string, metadata?: LogMetaData): void {
        this.logger.info(message,metadata)
    }

    warn(message: string, metadata?: LogMetaData): void {
        this.logger.warn(message, metadata)
    }

    

    error(
        message: string,
        error?: Error,
        metadata?: LogMetaData
    ): void {
        // ...
        this.logger.error(message, {
            ...metadata,
            error
        })
    }


    debug(message: string, metadata?: LogMetaData): void {
        // ...
        this.logger.debug(message,metadata)
    }
}

