// local authentication
// For more details go to https://github.com/jaredhanson/passport-local
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/conta/user');

module.exports = function (passport) {

    // Maintaining persistent login sessions
    // serialized  authenticated user to the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialized when subsequent requests are made
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({ 'email': email }, function (err, user) {
                    if (err) { return done(err); }
                    if (!user)
                        return done(null, false);

                    if (!user.verifyPassword(password))
                        return done(null, false);
                    else
                        return done(null, user);
                });
            });
        }));

    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({ 'email': email }, function (err, user) {
                        if (err) { return done(err); }
                        if (user) {
                            return done(null, false);
                        } else {
                            var newUser = new User();
                            newUser.username = req.body.username;
                            newUser.email = email;
                            newUser.password = newUser.generateHash(password);
                            newUser.name = req.body.username;
                            newUser.address = ''
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }

                    });
                } else {
                    var user = req.user;
                    user.username = req.body.username;
                    user.email = email;
                    user.password = user.generateHash(password);
                    user.name = req.body.username;
                    user.address = ''

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });

                }

            });


        }));

};
