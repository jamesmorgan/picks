exports.setup = function(app, mongoose) {

	var gameSchema = new mongoose.Schema({
		name: String,
		type: String,
		description: String,
		order: String,
		status: String,
		selections: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Selection'
		}]
	});

	var selectionSchema = new mongoose.Schema({
		name: String,
		pot: Number,
		value: Number,
		game: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Game'
		}
	});

	var Selection = mongoose.model('Selection', selectionSchema);
	var Game = mongoose.model('Game', gameSchema);

	// The routes below define what is used by AngularJS's ngResource module for
	// automatic backend resource management.

	// query
	app.get('/selections', function(req, res) {
		Selection.find({}, function(err, docs) {
			res.send(docs);
		});
	});

	app.get('/games', function(req, res) {
		Game.find({}, function(err, docs) {
			res.send(docs);
		});
	});

	// get
	app.get('/game/:id', function(req, res) {
		Game.findOne({
			_id: req.params.id
		}, function(err, data) {
			res.send(data);
		}).populate('selections');
	});
}