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
        usernameField: 'id',
        passwordField: 'password',
        passReqToCallback: true,
    }, (req, id, password, done) => {
        process.nextTick(() => {
            User.findById(id, (err, user) => {
                if (err) return done(err);
                if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.'));
                else
                    return done(null, user);
            });
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
        passReqCallback: true,
    }, (req, id, password, done) => {
        process.nextTick(() => {
            if (!req.user) {
                User.findById(id, (err, user) => {
                    if (err) return done(err, null);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Wohh! the ID is already taken.'));
                    } else {
                        let newUser = new User.User(
                            req.body.name,
                            bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                            req.body.name,
                            req.body.phone,
                            req.body.email,
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
