import { WinstonLogger } from "../infrastructure/logger/winston.logger";

const logger = new WinstonLogger();

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