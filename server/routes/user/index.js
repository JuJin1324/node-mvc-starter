const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../../middlewares/auth');

const userController = require('./user.controller');


router.get('/login', userController.getLogin);

/* 주의 사항: login 진행 시 passport 에서 successRedirect 에 원래 주고 싶었던 라우터는 '/' 였다.
 * '/' 라우터에는 미들웨어로 req.isAuthenticated() 가 true 이면(로그인이 되었으면) 페이지를 나타내고
 * false 이면 /user/login 페이지로 리다이렉트 시키는 로직이 추가되어 있다.
 *
 * 아래와 같이 successRedirect 에 '/' 를 주게 되면 처음 로그인 성공시에 successRedirect 지정된 '/' 라우터로 이동하게 된다.
 * 하지만 처음 로그인 시 '/' 라우터에 붙어 있는 미들웨어에서 사용하는 req.isAuthenticated() 가 false 를 반환하게 되며 해당 이유는 알 수가 없다.
 * (하지만 많은 사람이 격고있는 듯 하다)
 * 해당 문제를 우회하는 방법으로 단순히 '/' 라우터로 redirect 시켜주는 기능 뿐인 '/login-success' 라우터를
 * successRedirect 로 등록하는 것을 통해서 문제를 해결하였다.
 */
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/user/login-success',
    failureRedirect: '/user/login',
    failureFlash: true
}, null));

router.get('/login-success', userController.getLoginSuccess);
router.get('/signup', userController.getSignUp);

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/user/login',
    failureRedirect: '/user/signup',
    failureFlash: true
}, null));

router.get('/profile', auth.hasAuthenticated, userController.getProfile);
router.get('/logout', auth.hasAuthenticated, userController.getLogOut);

module.exports = router;
