var http = require('https');

module.exports = function(app, server, passport) {
    app
        .get('/api/location', function(req, res, next) {
            var options = {
                host: 'api.pickpoint.io',              
                path: '/v1/forward?key=yVgLwFwxYrx388XQs3Ck&q=teste'+ req.params.q,
                method: 'GET'
            };
            http.get(options, function(resp){
                    res.json(resp);
            }).on("error", function(e){
                console.log("Got error: " + e.message);
            });
        })
}