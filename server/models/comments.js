const dbConfig = require('../config/dbconfig');
const User = require('./users');

class Comments {
    constructor(title, content, createdDate) {
        this.title = title;
        this.content = content;
        this.createdDate = createdDate;
        this.user = null;
    }
}

const find = (callback) => {
    let sql = `
        SELECT TITLE      title
             , CONTENT    content
             , INPUT_TIME inputTime
        FROM DEV_COMMENTS
    `;
    dbConfig.query(sql, (err, rows) => {
        if (err) {
            callback(err, null);
        } else if (rows.length > 0) {
            let commentsList = rows.map(row => new Comments.Comments(row.title, row.content, row.inputTime));
            callback(null, commentsList);
        } else {
            callback(null, null);
        }
    });
}

const save = (comments, callback) => {
    User.findKeyById(comments.user.id, (err, userKey) => {
        let sql = `
            INSERT INTO DEV_COMMENTS(TITLE, CONTENT, DEL_FLAG, UPD_USER_KEY, INPUT_TIME) 
            VALUES ('${comments.title}', '${comments.content}', 'N', ${userKey}, NOW())
        `;
        dbConfig.query(sql, (err, rows) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null);
            }
        });
    });
}

module.exports = {
    Comments,
    save,
    find,
}
