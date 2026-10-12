What we will build today ...
Logging > Winston , JSon logs, Error Serialization,
Redaction

Tracing > open Telemetry > Trace Id > Spans > Context > propogation

Phase 1 Logging foundation

Phase 2 : Build the express api
Implement a few realistic endpoints, Morgan access logging, request IDs, centralized error middleware, HTTP status codes, and safe logging of request metadata.

Phase 3 — OpenTelemetry tracing
Initialize the SDK before application modules load, automatically instrument HTTP and Express, add custom spans, and understand trace IDs, span IDs, parent-child relationships, and context propagation.

Phase 4 — End-to-end observability
Connect logs to trace context, make multiple API calls, simulate slow dependencies and failures, and inspect the resulting traces and logs in a local observability backend.

Phase 5 — Production readiness
PII and token redaction, sampling, graceful shutdown, testing, metrics, dashboards, alerts, and optional Sentry or Azure Monitor integration.


Lets integrate morgan logging mechanism at express layer...

install morgan library , types/express, types/morgan

src/
├── infrastructure/
│   └── logging/
│       ├── logger.interface.ts
│       ├── logger.types.ts
│       ├── winston.logger.ts
│       ├── error-serializer.ts
│       └── morgan.middleware.ts     ← new

Morgan -> Writes access events -> Morgan adapter -> calls logger.info() ->  Winston logger -> Winston -> Json -> console


#Next phase 

Centeralized error handling + Request Ids

WE are building

Incoming HTTP REQUEST -> Request ID middleware -> Assingn unique ID to the request 

Express Route -> Returns data or forwards an error

Centeral Error Middleware -> Logs the error and returns a safe HTTP Response

Morgan access Log : Records the final http status and response time

Add Request context using Async local storage using Async Local Storage

Basicall adding a request context as a middleware and add requestId header in express as request header

Step1 .. Create request context in logging infra
expose a function requestContextMiddleware which returns a function which appends requestid in the response header and pass response to next cycle

Add request iD to winston logs 
So Add request context format which can added winston format logger.

So in info add the request ID in the winston.format method


