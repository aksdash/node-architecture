import winston from "winston";
import {WinstonLogger} from '../../../src/infrastructure/logger/winston.logger'


describe("WinstonLogger", () => {

    it("should delegate info logs to Winston", () => {

        const winstonMock = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn()
        } as unknown as winston.Logger;

        const logger = new WinstonLogger(winstonMock);

        logger.info("user.created", {
            userId: "123"
        });

        expect(winstonMock.info).toHaveBeenCalledWith(
            "user.created",
            {
                userId: "123"
            }
        );
    });

});