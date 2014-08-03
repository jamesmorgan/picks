var phantom = require('phantom');
var rest = require('restler');
var repeat = require('repeat');

var url = "http://www.worldgolfchampionships.com/bridgestone-invitational/leaderboard.html";
var phantomFunc = function() {
    var res = [];
    res = phantom.create(function(ph) {
        return ph.createPage(function(page) {
            console.log("opening site: ", url);
            return page.open(url, function(status) {
                console.log("opened site: ", status);

                page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', function() {
                    //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
                    setTimeout(function() {
                        return page.evaluate(function() {

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
                        });
                    }, 5000);
                });
            });
        });
    });
    return res;
};

console.log("TEST " + phantomFunc());
repeat(phantomFunc).every(1, 'min')
    .for(3, 'min')
    .start.now()
    .then(function() {
        console.log("Completed");
        process.exit(code = 0);
    });
