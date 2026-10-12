import express, { Express } from "express";

import { ILogger } from "../infrastructure/logger/logger.interface";
import { createMorganMiddleware } from "../infrastructure/logger/morgan.middleware";
export function createApp(logger: ILogger): Express {
    const app = express();

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

    return app;
}