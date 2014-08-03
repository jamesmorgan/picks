exports.setup = function(app, mongoose) {

    var errorFunc = function(error) {
        console.log('ERROR: ' + error);
    };

    var gameSchema = new mongoose.Schema({
        name: String,
        type: String,
        description: String,
        order: Boolean,
        status: String,
        image: String,
        pots: [String],
        gamePass: {
            type: String,
            select: false
        },
        adminPass: {
            type: String,
            select: false
        }
    });

    var selectionSchema = new mongoose.Schema({
        name: String,
        pot: Number,
        score: Number,
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game'
        }
    });

    var pickSchema = new mongoose.Schema({
        name: String,
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game'
        },
        selections: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Selection'
        }]
    });

    var Selection = mongoose.model('Selection', selectionSchema);
    var Game = mongoose.model('Game', gameSchema);
    var Pick = mongoose.model('Pick', pickSchema);

    // selections
    app.get('/selections', function(req, res) {
        console.log('GET /selections');
        Selection.find({})
            .exec()
            .then(function(data) {
                res.send(docs);
            }, errorFunc)
    });

    app.get('/selections/:gameid', function(req, res) {
        console.log('GET /selections/' + req.params.gameid);
        Selection.find({'game': req.params.gameid})
            .exec()
            .then(function(docs) {
                res.send(docs);
            }, errorFunc);
    });

    app.get('/selections/:gameid/find/:name', function(req, res) {
        console.log('GET /selections/' + req.params.gameid + '/find/' + req.params.name);
        Selection.findOne({'game': req.params.gameid, 'name': req.params.name})
            .exec()
            .then(function(doc) {
                res.send(doc);
            }, errorFunc);
    });

    app.post('/selections/:gameid/update', function(req, res) {
        console.log('GET /selections/' + req.params.gameid + '/update');
        var promise = Game.findOne({
            'adminPass': req.body.adminPass
        }).exec();
        promise
            .then(function(data) {
                if (data) {
                    return Selection.findByIdAndUpdate(req.body._id, {
                        $set: {
                            score: req.body.score
                        }
                    }).exec();
                } else {
                    throw new Error('Admin password incorrect!');
                }
            })
            .then(function(data) {
                res.send({
                    'update': true
                });
            }, function(error) {
                console.log('ERROR ' + error);
                res.send({
                    'error': error
                });
            });
    });

    app.post('/selections/:gameid/:pot', function(req, res) {
        console.log('GET /selections/' + req.params.gameid + '/' + req.params.pot);

        if (req.body) {
            req.body.map(function(sel) {
                console.log('adding [' + sel + '] to pot ' + req.params.pot + ' for game ' + req.params.gameid);

                var newSel = {
                    name: sel,
                    pot: req.params.pot,
                    score: 0,
                    game: req.params.gameid
                };

                Selection.create(newSel, function(err, dbSel) {
                    console.log('added to mongo [' + dbSel.name + ']');
                });

                res.send({
                    'update': true
                });
            });
        } else {
            res.send({
                'update': false
            });
        }
    });

    // games
    app.get('/games', function(req, res) {
        console.log('GET /games');
        Game.find({})
            .exec()
            .then(function(docs) {
                res.send(docs);
            }, errorFunc);
    });

    app.get('/game/:id', function(req, res) {
        console.log('GET /game/' + req.params.id);
        Game.findOne({
            _id: req.params.id
        }, function(err, data) {
            res.send(data);
        });
    });

    app.get('/game/:id/auth/:pass', function(req, res) {
        console.log('GET /game/' + req.params.id + '/auth/******');
        Game.findOne({
            'adminPass': req.params.pass
        }, function(err, data) {
            if (data) {
                res.send({
                    'auth': true
                });
            } else {
                res.send({
                    'auth': false
                });
            }
        });
    });

    // picks
    app.post('/picks', function(req, res) {
        console.log('POST /picks');
        Pick.create(req.body, function(err, picks) {
            res.send(picks);
        });
    });

    app.get('/picks/:gameid', function(req, res) {
        console.log('GET /picks/' + req.params.gameid);
        Pick.find({
            game: req.params.gameid
        }, function(err, data) {
            res.send(data);
        }).populate('selections');
    });
}
