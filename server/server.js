var path = require('path'),
	express = require('express'),
	app = express(),
	mongoose = require('mongoose');

var dbURI = 'mongodb://' + process.env.MONGOLABUSR + ':' + process.env.MONGOLABPW + '@' + process.env.MONGOLABURI + ':' + process.env.MONGOLABPORT + '/picks';

console.log('connecting to ' + dbURI);

mongoose.connect(dbURI);

// Needs to be used in such that req.body automatically gets parsed properly.
app.use(express.bodyParser());

// First looks for a static file: index.html, css, images, etc.
app.use("/app", express.compress());
app.use("/app", express.static(path.resolve(__dirname, "../app")));
app.use("/app", function(req, res, next) {
	res.send(404);
});
//app.use(express.logger()); // Log requests to the console

// Setup models and controllers.
// Both Model and Controller is kept in same file for simplicity sake
var selections = require('./controllers/api');
selections.setup(app, mongoose);

// This is the route that sends the base index.html file all other routes are
// for data only, no server-side views here.
app.all('/', function(req, res) {
	res.sendfile('index.html', {
		root: "../app"
	});
});

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Server listening on port ' + port);