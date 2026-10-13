import winston from "winston";
import { WinstonLogger } from "../infrastructure/logger/winston.logger";
import { createApp } from "./app";
import { errorSerializationFormat } from "../infrastructure/logger/error-serializer.format";
import { requestContextFormat } from "../infrastructure/logger/request-context.format";
import { traceContextFormat } from "../infrastructure/logger/trace-context.format";
const winstonInstance =  winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        errorSerializationFormat(),
        requestContextFormat(),
        traceContextFormat(),
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [new winston.transports.Console()]
})

const logger = new WinstonLogger(winstonInstance)

const app = createApp(logger)

const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, () => {
    logger.info("application.started", { port });
});