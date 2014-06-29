// require http, handlers, url, path, server-handlers
var http = require('http');
var url = require('url');
var path = require('path');
var handlers = require('./server-handlers');

var port = 3000;
var ip = '127.0.0.1';

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

// create a router function
    // handles each type of http request 'GET, POST, etc..'
var router = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var method = req.method;
  if (pathname === 'classes/messages') {
    handlers.postMessage(req, res);
  } else if (method === 'GET') {
    handlers.getMessages(req, res);
  } else if (method === 'OPTIONS') {
    handlers.respondWithOptions(req, res);
  } else {
    handlers.respond404(req, res);
  }
};
// create a server function
    // takes a router function as a callback
var server = http.createServer(function (req, res) {
  router(req, res);
});

server.listen(port, ip);
console.log("Listening on http://" + ip + ":" + port);


