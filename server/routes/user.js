const express = require('express');
const router = express.Router();

/* GET login. */
router.get('/login', (req, res) => {
    // res.render('pages/login', {title: '로그인 페이지', message: req.flash('loginMessage')});
    res.render('pages/login', {title: '로그인 페이지'});
});

router.post('/login', (req, res) => {
    res.send('respond with a resource');
});

/* GET sign-in*/
router.get('/sign-up', (req, res) => {
    // res.render('pages/signin', {title: '회원 가입 페이지', message: req.flash('signupMessage')});
    res.render('pages/signup', {title: '회원 가입 페이지'});
});

router.post('/sign-up', (req, res) => {
    res.send('respond with a resource');
});

router.get('/profile', (req, res) => {
    res.render('pages/profile', {
        title: '사용자 프로필',
        userId: '테스트-아이디',
        userName: '테스트-이름',
        userPhone: '010-1234-1234',
        userEmail: 'test@gmail.com',
    });
});

router.get('/logout', (req, res) => {
    res.redirect('/user/login');
});

module.exports = router;
