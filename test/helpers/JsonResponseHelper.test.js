"use strict";

const JsonResponseHelper = require("../../src/helpers/JsonResponseHelper");

test('has correct status and headers', () => {
    const response = JsonResponseHelper.createResponse({});
    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual(JsonResponseHelper.DEFAULT_HEADERS());
});

test('can send an error', () => {
    const failMessage = "it failed";
    const response = JsonResponseHelper.createErrorResponse(failMessage);
    expect(response.statusCode).toBe(500);
    expect(response.headers).toEqual({"access-control-allow-origin": "*"});
    expect(response.body).toEqual('{"status":"error","message":"' + failMessage + '"}');
});

test('parses body', () => {
    const response = JsonResponseHelper.createResponse({"message":"hello"});
    expect(response.body).toEqual('{"message":"hello"}');
});
