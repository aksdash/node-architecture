import express, { Express } from "express";
import { HttpError, createErrorMiddleware } from "../middleware/error-handler";
import { ILogger } from "../infrastructure/logger/logger.interface";
import { createMorganMiddleware } from "../infrastructure/logger/morgan.middleware";
import { requestHandlerMiddleware } from "../infrastructure/logger/request-context";
import {trace,SpanStatusCode} from  '@opentelemetry/api'
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

    // app.get("/api/products/:id", (req, res) => {
    //     const product = {
    //         id: req.params.id,
    //         name: "Sensor A"
    //     };

    //     res.status(200).json({ product });
    // });

     app.get("/api/product/:id", async (req, res, next) => {
    try {
        const product = await getProductFromDatabase(
            req.params.id, logger
        );

        res.status(200).json({ product });
    } catch (error) {
        next(error);
    }
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



/*async function getProductsFromDatabase(id: string){
    const tracer = trace.getTracer('product-service')
    return tracer.startActiveSpan(
        'database.getProduct', async(span) => {
            try {
                  span.setAttribute("db.system", "mock");
                 span.setAttribute("product.id", id);

             // Simulate a database query taking 300 ms
                await new Promise(resolve =>
                    setTimeout(resolve, 3000)
                );

                return { id, name: "Sensor B" };
            }catch(err){
                span.recordException(
                    err instanceof Error ? err : new Error(String(err))
                    
                )

                span.setStatus({
                    code: SpanStatusCode.ERROR
                });

            }finally{
                span.end()
            }
        }
          
        
    )
}*/


async function getProductFromDatabase(
    id: string,
    logger: ILogger
) {
    const tracer = trace.getTracer("product-service");

    return tracer.startActiveSpan(
        "database.getProduct",
        async (span) => {
            try {
                span.setAttribute("db.system", "mock");
                span.setAttribute("product.id", id);

                if (id === "500") {
                    throw new Error("Simulated database connection failure");
                }

                await new Promise(resolve => setTimeout(resolve, 300));

                return { id, name: "Sensor A" };
            } catch (cause) {
                const error = cause instanceof Error
                    ? cause
                    : new Error(String(cause));

                span.recordException(error);
                span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: error.message
                });

                // Logged while database.getProduct is still active
                logger.error("database.product.fetch.failed", error, {
                    productId: id
                });

                throw error;
            } finally {
                span.end();
            }
        }
    );
}