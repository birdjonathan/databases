var db = require('./db');
var Promise = require('bluebird');
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};
var collectData = function (req, cb) {
  var data = '';
  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function () {
    cb(null, JSON.parse(data));
  });
};
var sendResponse = function (res, obj, status) {
  status = status || 200;
  res.writeHead(status, headers);
  res.end(JSON.stringify(obj));
};
var parseData = Promise.promisify(collectData);
var saveMessage = Promise.promisify(db.saveMessage);
var findMessages = Promise.promisify(db.findMessages);
var findUser = Promise.promisify(db.findUser);

exports.postMessage = function (req, res) {
  var message;
  parseData(req).then(
    function (msg) {
      message = msg;
      return findUser({username: msg.username});
    }
  ).then(
    function (results) {
      if (!results.length) {
        return saveUser(message.username);
      }

      return new Promise(
        function (resolve, reject) {
          resolve(results);
        }
      );
    }
  ).then(
    function (results) {
      var userId;
      if (Array.isArray(results)) {
        userId = results[0].id;
      } else {
        userId = results.insertId;
      }
      var chat = {
        text: message.text,
        user_id: userId,
        room_id: message.room_id
      };
      return saveMessage(chat);
    }
  ).then(
    function () {
      sendResponse(res, message);
    } 
  ).catch(
    function () {
      console.log('Error: catching POST message error.'); 
    }
  );
};

exports.getMessages = function (req, res) {
  findMessages().then(
    function (messages) {
      sendResponse(res, messages);
    }
  );
};

exports.respondWithOptions = function (req, res) {
  sendResponse(res, null);
};
