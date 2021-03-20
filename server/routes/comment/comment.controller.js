const models = require('../../models/raw');

exports.list = (req, res) => {
    models.comment.findAll().then(commentsList => {
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
    let comment = new models.comment.Comment(title, content, null);
    comment.user = req.user;
    models.comment.save(comment).then(() => {
        res.redirect('/comment')
    }).catch(err => {
        return res.send(400, {message: err});
    });
};
