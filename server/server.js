var path     = require('path'),
    express  = require('express'),
    app      = express(),
    mongoose = require('mongoose');

var dbusr = process.env.MONGOLABUSR,
    dbpw  = process.env.MONGOLABPW,
    db    = 'picks',
    dbURI = 'mongodb://picks:picks@ds027908.mongolab.com:27908/' + db;

mongoose.connect(dbURI);
// var connection = mongoose.createConnection(dbURI);

// // When successfully connected
// connection.on('connected', function() {
//     console.log('Mongoose connection open to db: ' + db);
// });

// // If the connection throws an error
// connection.on('error', function(err) {
//     console.log('Mongoose default connection error: ' + err);
// });

// // When the connection is disconnected
// connection.on('disconnected', function() {
//     console.log('Mongoose default connection disconnected!');
// });

// // If the Node process ends, close the Mongoose connection
// process.on('SIGINT', function() {
//     connection.close(function() {
//         console.log('Mongoose default connection disconnected through app termination');
//         process.exit(0);
//     });
// });

// Needs to be used in such that req.body automatically gets parsed properly.
app.use(express.bodyParser());

// First looks for a static file: index.html, css, images, etc.
app.use("/app", express.compress());
app.use("/app", express.static(path.resolve(__dirname, "../app")));
app.use("/app", function(req, res, next) {
  res.send(404);
});
app.use(express.logger()); // Log requests to the console

// Setup models and controllers.
// Both Model and Controller is kept in same file for simplicity sake
var users = require('./controllers/users');
users.setup(app, mongoose);

var selections = require('./controllers/selections');
selections.setup(app, mongoose);

// This is the route that sends the base index.html file all other routes are
// for data only, no server-side views here.
app.all('/', function(req, res) {
  res.sendfile('index.html', { root: "../app" });
});

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Server listening on port ' + port);
