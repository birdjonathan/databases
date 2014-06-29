var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "hackreactor",
  database: "chat"
});

var executeQuery = function (query, params, cb) {
  if (!cb) {
    cb = params;
    dbConnection.query(query, function (err, results) {
      cb(err, results);
    });
  } else {
    dbConnection.query(query, params, function (err, results) {
      cb(err, results);
    });
  }
};

exports.saveMessage = function (message, cb){
  executeQuery('INSERT INTO messages SET ?', message, cb);
};

exports.findMessages = function (cb) {
  executeQuery('SELECT messages.id, messages.text, messages.room_id, users.name \
                FROM messages LEFT OUTER JOIN users ON messages.user_id \
                ORDER BY messages.id DESC', cb);
};

exports.findUser = function(username, cb){
  executeQuery('SELECT * FROM users WHERE username = ? LIMIT 1', [username], cb);
};

dbConnection.connect();
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/



