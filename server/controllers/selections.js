exports.setup = function(app, mongoose) {

	var selectionSchema = new mongoose.Schema({
		name: String,
		pot: Number,
		value: Number,
		gameId: String
	});

	var Selection = mongoose.model('Selection', selectionSchema);

	// The routes below define what is used by AngularJS's ngResource module for
	// automatic backend resource management.

	// query
	app.get('/selections', function(req, res) {
		Selection.find({}, function(err, docs) {
			res.send(docs);
		});
	});
}