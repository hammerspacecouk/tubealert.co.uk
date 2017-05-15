const http = require('http');
const fs = require('fs');
const pathUtil = require('path');
const Handler = require('./handler');

const port = 8888;

http.createServer(function(request, response) {
  const path = request.url;
  // handle static
  if (path === '/sw.js') {
    fs.readFile('./build/static-low-cache/sw.js', function(error, content) {
      response.writeHead(200, {'content-type': 'application/javascript'});
      response.end(content, 'utf-8');
    });
    return;
  }

  if (path.startsWith('/static/')) {
    const filePath = './build' + path;

    const extname = pathUtil.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
    }

    fs.readFile(filePath, function(error, content) {
      if (error) {
        const newPath = filePath.replace('static', 'static-low-cache');
        fs.readFile(newPath, function(error, content) {
          if (error) {
            response.writeHead(404);
            response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            response.end();
          } else {
            response.writeHead(200, { 'content-type': contentType });
            response.end(content, 'utf-8');
          }
        });
      } else {
        response.writeHead(200, { 'content-type': contentType });
        response.end(content, 'utf-8');
      }
    });
    return;
  }

  // handle dynamic
  const event = {path};
  const callback = (error, result) => {
    response.writeHead(result.statusCode, result.headers);
    response.write(result.body);
    response.end();
  };

  Handler.webapp(event, null, callback);

}).listen(port);

console.log('Server running at http://localhost:' + port);
