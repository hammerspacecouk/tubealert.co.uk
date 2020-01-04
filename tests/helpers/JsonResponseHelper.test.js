const JsonResponseHelper = require("../../src/helpers/JsonResponseHelper");

test("has correct status and headers", () => {
  const response = JsonResponseHelper.createResponse({});
  expect(response.statusCode).toBe(200);
  expect(response.headers).toEqual(JsonResponseHelper.DEFAULT_HEADERS());
});

test("sends cache control header", () => {
  const response = JsonResponseHelper.createResponse({}, 320);
  expect(response.statusCode).toBe(200);
  expect(response.headers["cache-control"]).toEqual("public, max-age=320");
});

test("can send an error", () => {
  const failMessage = "it failed";
  const response = JsonResponseHelper.createErrorResponse(failMessage);
  expect(response.statusCode).toBe(500);
  expect(response.headers).toEqual({ "content-type": "application/json" });
  expect(response.body).toEqual(`{"status":"error","message":"${failMessage}"}`);
});

test("parses body", () => {
  const response = JsonResponseHelper.createResponse({ message: "hello" });
  expect(response.body).toEqual('{"message":"hello"}');
});
