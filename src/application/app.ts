import express, { Express } from "express";
import { HttpError, createErrorMiddleware } from "../middleware/error-handler";
import { ILogger } from "../infrastructure/logger/logger.interface";
import { createMorganMiddleware } from "../infrastructure/logger/morgan.middleware";
import { requestHandlerMiddleware } from "../infrastructure/logger/request-context";
export function createApp(logger: ILogger): Express {
    const app = express();

    // 1. Establish context before anything that logs.
    app.use(requestHandlerMiddleware())

    // Register access logging before the routes.

    app.use(createMorganMiddleware(logger));

    app.use(express.json());

    app.get("/api/health", (_req, res) => {
        res.status(200).json({
            status: "healthy"
        });
    });

    app.get("/api/products", (_req, res) => {
        const products = [
            { id: "101", name: "Sensor A" },
            { id: "102", name: "Sensor B" }
        ];

        logger.info("products.fetch.completed", {
            count: products.length
        });

        res.status(200).json({ products });
    });

    app.get("/api/products/:id", (req, res) => {
        const product = {
            id: req.params.id,
            name: "Sensor A"
        };

        res.status(200).json({ product });
    });

     app.use((req, _res, next) => {
        next(new HttpError(
            404,
            `Route not found: ${req.method} ${req.path}`
        ));
    });

    app.use(createErrorMiddleware(logger))


    return app;
}