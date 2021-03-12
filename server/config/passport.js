const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt-nodejs');
const logger = require('../../lib/logger');

module.exports = passport => {
    /* session 을 위한 user 직렬화 */
    passport.serializeUser((user, done) => {
        logger.debug('[serializeUser] user: ' + JSON.stringify(user, null, 4));
        done(null, user.id);
    });

    /* session 을 위한 user 역직렬화 */
    passport.deserializeUser((id, done) => {
        logger.debug('[deserializeUser] id: ' + id);
        User.findById(id).then(user => {
            done(null, user);
        }).catch(err => {
            logger.error(err);
            done(err);
        });
    });

    /* passport-local Strategy 사용 */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'userPassword',
        passReqToCallback: true,
    }, (req, userId, userPassword, done) => {
        logger.debug(`[local-login] LocalStrategy: [userId: ${userId}, userPassword: ${userPassword}]`);

        User.findById(userId).then(user => {
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
        }).catch(err => {
            logger.error(err);
            return done(err);
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'userPassword',
        passReqToCallback: true,
    }, (req, userId, userPassword, done) => {
        process.nextTick(async () => {
            logger.debug(`[local-signup] LocalStrategy: [userId: ${userId}, userPassword: ${userPassword}]`);
            if (!req.user) {
                try {
                    const user = await User.findById(userId);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', '이미 사용 중인 아이디입니다.'));
                    }

                    const encryptedPassword =
                        bcrypt.hashSync(userPassword, bcrypt.genSaltSync(8), null);
                    let newUser = new User.User(
                        userId,
                        encryptedPassword,
                        req.body.userName,
                        req.body.userPhone,
                        req.body.userEmail,
                    );
                    await User.save(newUser);
                    return done(null, newUser);
                } catch (err) {
                    logger.error(err);
                    return done(err);
                }
            }
        });
    }));
}
