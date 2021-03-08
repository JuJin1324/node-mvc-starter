const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET login. */
router.get('/login', (req, res) => {
    // res.render('pages/login', {title: '로그인 페이지', message: req.flash('loginMessage')});
    res.render('pages/login', {title: '로그인 페이지'});
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}));

/* GET sign-in*/
router.get('/signup', (req, res) => {
    // res.render('pages/signin', {title: '회원 가입 페이지', message: req.flash('signupMessage')});
    res.render('pages/signup', {title: '회원 가입 페이지'});
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('/user/login');
}

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('pages/profile', {
        title: '사용자 프로필',
        userId: '테스트-아이디',
        userName: '테스트-이름',
        userPhone: '010-1234-1234',
        userEmail: 'test@gmail.com',
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/user/login');
});

module.exports = router;
