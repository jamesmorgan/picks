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

	// query
	app.get('/selections', function(req, res) {
		console.log("GET /selections");
		Selection.find({}, function(err, docs) {
			res.send(docs);
		});
	});

	app.get('/selections/:gameid', function(req, res) {
		console.log("GET /selections/" + req.params.gameid);
		Selection.find({ "game": req.params.gameid }, function(err, docs) {
			res.send(docs);
		});
	});

	app.get('/games', function(req, res) {
		Game.find({}, function(err, docs) {
			res.send(docs);
		});
	});

	app.get('/game/:id', function(req, res) {
		Game.findOne({
			_id: req.params.id
		}, function(err, data) {
			res.send(data);
		}).populate('selections');
	});
}