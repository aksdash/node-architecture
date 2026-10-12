import { serializeError } from "../../../src/infrastructure/logger/error-serializer";



describe("serializeError", () => {
    it("should preserve the name, message and stack", () => {
        const error = new Error(
            "Database connection failed"
        );

        const result = serializeError(error);

        expect(result.name).toBe("Error");
        expect(result.message).toBe(
            "Database connection failed"
        );
        expect(result.stack).toContain(
            "Database connection failed"
        );
    });
});