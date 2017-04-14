"use strict";

class JsonResponseHelper {
    static DEFAULT_HEADERS() {
        return {
            "access-control-allow-origin": "*",
            "cache-control": "public, max-age: 120"
        }
    };

    static createResponse(data, status = 200) {
        return {
            "statusCode": status,
            "headers": JsonResponseHelper.DEFAULT_HEADERS(),
            "body": JSON.stringify(data),
        }
    };

    static createErrorResponse(message) {
        return {
            "statusCode": 500,
            "headers": {"access-control-allow-origin": "*"},
            "body": JSON.stringify({
                "status": "error",
                "message": message
            }),
        }
    }
}

module.exports = JsonResponseHelper;
