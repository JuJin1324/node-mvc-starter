const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt-nodejs');
const logger = require('../../lib/logger');

module.exports = passport => {
    /* session 을 위한 user 직렬화 */
    passport.serializeUser((user, done) => {
        logger.debug('[serializeUser] user: ' + JSON.stringify(user, ' ', 4));
        done(null, user.id);
    });

    /* session 을 위한 user 역직렬화 */
    passport.deserializeUser((id, done) => {
        logger.debug('[deserializeUser] id: ' + id);
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
            logger.debug(`[local-login] LocalStrategy: [userId: ${userId}, userPassword: ${userPassword}]`);
            User.findById(userId, (err, user) => {
                if (err) return done(err);

                if (!user) {
                    logger.debug('존재하지 않는 사용자입니다: ' + userId);
                    /* TODO: req.flash: view 에 flash 메시지 뿌리기, Node-Starter 참조. */
                    return done(null, false, req.flash('loginMessage', '존재하지 않는 사용자입니다.'));
                } else if (!user.validPassword(userPassword)) {
                    logger.debug('비밀번호가 일치하지 않습니다: ' + userPassword);
                    return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
                } else {
                    logger.debug('로그인 성공!');
                    return done(null, user);
                }
            });
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'userPassword',
        passReqToCallback: true,
    }, (req, userId, userPassword, done) => {
        process.nextTick(() => {
            logger.debug(`[local-signup] LocalStrategy: [userId: ${userId}, userPassword: ${userPassword}]`);
            if (!req.user) {
                User.findById(userId, (err, user) => {
                    if (err) return done(err, null);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', '이미 사용 중인 아이디입니다.'));
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
