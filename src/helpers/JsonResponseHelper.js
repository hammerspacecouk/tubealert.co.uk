class JsonResponseHelper {
  static DEFAULT_HEADERS() {
    return {
      'content-type': 'application/json'
    };
  }

  static createResponse(data, cacheSeconds = null) {
    const headers = JsonResponseHelper.DEFAULT_HEADERS();
    if (cacheSeconds) {
      headers['cache-control'] = `public, max-age=${cacheSeconds}`;
    }

    return {
      statusCode: 200,
      headers,
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
