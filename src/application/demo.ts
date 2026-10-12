import { errorSerializationFormat } from "../infrastructure/logger/error-serializer.format";
import { WinstonLogger } from "../infrastructure/logger/winston.logger";
import winston from "winston";


const winstonInstance = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        errorSerializationFormat(),
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [
        new winston.transports.Console()
    ]
});

const logger = new WinstonLogger(winstonInstance);

logger.info("application.started")

logger.info("user.created", {
    userId: "123",
    source: "registration"
});

logger.warn("user.login.retry", {
    userId: "123",
    attempt: 2
});

logger.debug("database.query", {
    query: "findUser"
});


try {
    throw new Error ("Database Connection failed")
}catch(error){
    logger.error("database.connection.failed",
        error as Error,
        {
            database : 'users'
        }

    )
}