var phantom = require('phantom');

var url = "http://www.worldgolfchampionships.com/bridgestone-invitational/leaderboard.html";
phantom.create(function(ph) {
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
                            var total = $.trim($(this).find('.col-total').html());  
                            var player = $.trim($(this).find('.col-player div .expansion').html());  
                            playerAndTotal.push({pos: pos, player: player, total: total});         
                        });
             
                        return playerAndTotal;
                    }, function(result) {
                         console.log(result);
                        ph.exit();
                    });
                }, 5000);

            });
        });
    });
});
