const Comment = require('../models/comment');

const list = (req, res) => {
    Comment.findAll().then(commentsList => {
        console.log('commentsList:', commentsList);
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
    let comment = new Comment.Comment(title, content, null);
    comment.user = req.user;
    Comment.save(comment).then(() => {
        res.redirect('/comment')
    }).catch(err => {
        return res.send(400, {message: err});
    });
}

module.exports = {
    list,
    create,
}
