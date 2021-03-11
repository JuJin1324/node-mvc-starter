const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../middleware/auth');

/* GET login. */
router.get('/login', (req, res) => {
    // res.render('pages/login', {title: '로그인 페이지', message: req.flash('loginMessage')});
    res.render('pages/login', {title: '로그인 페이지'});
});

router.post('/login', passport.authenticate('local-login', {
    // successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}, null));

/* GET sign-in*/
router.get('/signup', (req, res) => {
    // res.render('pages/signin', {title: '회원 가입 페이지', message: req.flash('signupMessage')});
    res.render('pages/signup', {title: '회원 가입 페이지'});
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}, null));

router.get('/profile', authMiddleware.isLoggedIn, (req, res) => {
    res.render('pages/profile', {
        title: '사용자 프로필',
        userId: req.user.id ? req.user.id : '-',
        userName: req.user.name ? req.user.name : '-',
        userPhone: req.user.phone ? req.user.phone : '-',
        userEmail: req.user.email ? req.user.email : '-',
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/user/login');
});

module.exports = router;
