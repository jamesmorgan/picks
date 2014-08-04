var phantom = require('phantom');
var rest = require('restler');
var repeat = require('repeat');

// should be part of seed params ideally passed to phantom
var url = "http://www.worldgolfchampionships.com/bridgestone-invitational/leaderboard.html";

var phantomFunc = function() {
    // should we create a new phantom browser on each run?
    phantom.create(function(ph) {
        return ph.createPage(function(page) {
            console.log("opening site: ", url);
            
            return page.open(url, function(status) {
                console.log("opened site: ", status);

                page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', function() {
                    //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
                    setTimeout(function() {
                        return page.evaluate(function() {

                            // this logic needs extracting and plugged in so can be used for multiple sites/
                            var playerAndTotal = []
                            $('.row-main').each(function() {
                                var pos = $.trim($(this).find('.col-pos').html());
                                var score = $.trim($(this).find('.col-total').html());
                                var player = $.trim($(this).find('.col-player div .expansion').html());
                                playerAndTotal.push({
                                    pos: pos,
                                    player: player,
                                    score: score
                                });
                            });

                            return playerAndTotal;
                        }, function(result) {

                            // extract to a find and update service based on the result array
                            console.log('found ' + result.length + ' players');
                            result.forEach(function(player) {
                                console.log(player.player);
                                rest.get('http://picks.whatsthescore.webfactional.com/selections/53de3289e4b00257865775cd/find/' + player.player)
                                    .on('complete', function(data) {
                                        if (data && data._id) {
                                            console.log('found ' + player.player + ' > ' + data._id + ' : ' + player.score);
                                            return rest.post('http://picks.whatsthescore.webfactional.com/selections/53de3289e4b00257865775cd/update', {
                                                data: {
                                                    adminPass: 'Bird',
                                                    _id: data._id,
                                                    score: player.score
                                                }
                                            }).on('complete', function(data, response) {
                                                if (response.statusCode == 200) {
                                                    console.log('updated ' + player.player + ' to ' + player.score)
                                                }
                                            });
                                        }
                                    });
                            });
                            ph.exit();
                        });
                    }, 5000);
                });
            });
        });
    });
};

repeat(phantomFunc).every(1, 'min')
    .for(3, 'min')
    .start.now()
    .then(function() {
        console.log("Completed");
        process.exit(code = 0);
    });
