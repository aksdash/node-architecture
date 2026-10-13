import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { PeriodicExportingMetricReader,ConsoleMetricExporter } from "@opentelemetry/sdk-metrics";
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);


const sdk = new NodeSDK({
    traceExporter: new ConsoleSpanExporter(),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter()
    }),
    instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation()
    ]
});

sdk.start();

console.log("OpenTelemetry SDK started");