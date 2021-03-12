const Comment = require('../models/comment');

const list = (req, res) => {
    Comment.findAll().then(commentsList => {
        res.render('pages/comments', {
            title: 'Comment Page',
            comments: commentsList,
        });
    }).catch(err => {
        return res.send(400, {message: err});
    });
};

const create = (req, res) => {
    let {title, content} = req.body;
    let comments = new Comment.Comment(title, content, null);
    comments.user = req.user;
    Comment.save(comments).then(() => {
        res.redirect('/user/comments');
    }).catch(err => {
        return res.send(400, {message: err});
    });
}

module.exports = {
    list,
    create,
}
