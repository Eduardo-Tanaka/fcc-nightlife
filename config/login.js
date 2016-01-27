var User = require('../models/user');
var GitHubStrategy = require('passport-github').Strategy;

module.exports = function(passport) {
	passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://basejump-eduardo-tanaka.c9users.io/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOrCreate({ githubId: profile.id }, function (err, user) {
                return done(err, user);
            });
        }
    ));
}