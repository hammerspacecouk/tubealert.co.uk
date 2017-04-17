class JsonResponseHelper {
  static DEFAULT_HEADERS() {
    return {
      'access-control-allow-origin': '*',
      'content-type': 'application/json',
    };
  }

  static createResponse(data, status = 200) {
    return {
      statusCode: status,
      headers: JsonResponseHelper.DEFAULT_HEADERS(),
      body: JSON.stringify(data),
    };
  }

  static createErrorResponse(message) {
    return {
      statusCode: 500,
      // will not use the default headers as we don't want to cache errors
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        status: 'error',
        message,
      }),
    };
  }
}

module.exports = JsonResponseHelper;
