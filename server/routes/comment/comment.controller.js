const CommentController = require('../../models/comment');

exports.list = (req, res) => {
    CommentController.findAll().then(commentsList => {
        console.log('commentsList:', commentsList);
        res.render('pages/comments', {
            title: 'CommentController Page',
            comments: commentsList,
        });
    }).catch(err => {
        return res.send(400, {message: err});
    });
};

exports.create = (req, res) => {
    let {title, content} = req.body;
    let comment = new CommentController.Comment(title, content, null);
    comment.user = req.user;
    CommentController.save(comment).then(() => {
        res.redirect('/comment')
    }).catch(err => {
        return res.send(400, {message: err});
    });
};
