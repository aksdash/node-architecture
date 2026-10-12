import winston from "winston";
import { serializeError } from "./error-serializer";

function serializeNestedErrors(
    value: unknown,
    seen: WeakSet<object> = new WeakSet()
): unknown {
    if (value instanceof Error) {
        return serializeError(value);
    }

    if (value === null || typeof value !== "object") {
        return value;
    }

    if (seen.has(value)) {
        return "[Circular]";
    }

    seen.add(value);

    if (Array.isArray(value)) {
        return value.map(item =>
            serializeNestedErrors(item, seen)
        );
    }

    const result: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
        result[key] = serializeNestedErrors(
            nestedValue,
            seen
        );
    }

    return result;
}

export const errorSerializationFormat = winston.format(
    info => {
        // Keep Winston's original log-info object and its
        // internal symbol properties intact.
        for (const key of Object.keys(info)) {
            info[key] = serializeNestedErrors(info[key]);
        }

        return info;
    }
);