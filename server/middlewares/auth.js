exports.hasAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('/user/login');
}
