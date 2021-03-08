const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt-nodejs');

module.exports = passport => {
    /* session 을 위한 user 직렬화 */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    /* session 을 위한 user 역직렬화 */
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    /* passport-local Strategy 사용 */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'userPassword',
        passReqToCallback: true,
    }, (req, userId, userPassword, done) => {
        process.nextTick(() => {
            User.findById(userId, (err, user) => {
                if (err) return done(err);
                if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(userPassword))
                    return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.'));
                else
                    return done(null, user);
            });
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'userPassword',
        passReqToCallback: true,
    }, (req, userId, userPassword, done) => {
        process.nextTick(() => {
            if (!req.user) {
                User.findById(userId, (err, user) => {
                    if (err) return done(err, null);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Wohh! the ID is already taken.'));
                    } else {
                        let newUser = new User.User(
                            userId,
                            bcrypt.hashSync(userPassword, bcrypt.genSaltSync(8), null),
                            req.body.userName,
                            req.body.userPhone,
                            req.body.userEmail,
                        );
                        User.save(newUser, (err) => {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });
            }
        });
    }));
}
