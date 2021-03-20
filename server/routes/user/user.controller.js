const logger = require('../../../lib/logger');

exports.getLogin = (req, res) => {
    let flash = req.flash();
    if (flash.error) {
        flash = {
            type: 'danger',
            message: flash.error[0],
        };
    } else {
        flash = null;
    }

    res.render('pages/login', {title: '로그인 페이지', flash: flash});
    // res.render('pages/login', {title: '로그인 페이지', message: req.flash('loginMessage')});
};

exports.getLoginSuccess = (req, res) => {
    res.redirect('/');
};

exports.getSignUp = (req, res) => {
    // res.render('pages/signin', {title: '회원 가입 페이지', message: req.flash('signupMessage')});
    res.render('pages/signup', {title: '회원 가입 페이지'});
};

exports.getProfile = (req, res) => {
    res.render('pages/profile', {
        title: '사용자 프로필',
        userId: req.user.id ? req.user.id : '-',
        userName: req.user.name ? req.user.name : '-',
        userPhone: req.user.phone ? req.user.phone : '-',
        userEmail: req.user.email ? req.user.email : '-',
    });
};

exports.getLogOut = (req, res) => {
    req.logout();
    req.session.destroy(err => {
        if (err) {
            logger.error(err);
            return;
        }
        res.redirect('/user/login');
    });
};
