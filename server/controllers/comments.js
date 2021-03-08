const Comments = require('../models/comments');

const list = (req, res) => {
    Comments.find((err, comments) => {
        if (err) {
            return res.send(400, {message: err});
        }

        res.render('pages/comments', {
            title: 'Comments Page',
            comments: comments,
        })
    });
};

const create = (req, res) => {
    let {title, content} = req.body;
    let comments = new Comments.Comments(title, content, null);
    comments.user = req.user;
    Comments.save(comments, err => {
        if (err) {
            return res.send(400, {message: err});
        }
        res.redirect('user/comments');
    });
}

const hasAuthorization = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('user/login');
}

module.exports = {
    list,
    create,
    hasAuthorization,
}
