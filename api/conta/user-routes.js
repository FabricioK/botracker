module.exports = function (app, server, passport) {
    app
        .post('/api/login', function(req, res, next) {
            passport.authenticate('local', function (err, user, info) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401);
                }

                // Manually establish the session...
                req.login(user, function (err) {
                    if (err) return next(err);
                    return res.json({
                        message: 'user authenticated',
                    });
                });
            })(req, res, next);
        })
        .post('/api/signup', function(req, res, next) {
            passport.authenticate('signup', function (err, user, info) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401);
                }
                // Manually establish the session...
                req.login(user, function (err) {
                    if (err) return next(err);
                    return res.json({
                        message: 'user authenticated',
                    });
                });
            })(req, res, next);
        });
}