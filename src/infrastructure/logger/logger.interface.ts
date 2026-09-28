import { LogMetaData } from "./logger.type";

export interface ILogger {
    info(message: string, metaData?: LogMetaData): void;
    warn(message: string, metadata?: LogMetaData): void;
    error(
        message: string,
        error?: Error,
        metadata?: LogMetaData
    ): void;
    debug(message: string, metadata?: LogMetaData): void;
}

