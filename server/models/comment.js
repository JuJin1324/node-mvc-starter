const dbConfig = require('../config/dbconfig');
const User = require('./users');

class Comment {
    constructor(title, content, createdDate) {
        this.title = title;
        this.content = content;
        this.createdDate = createdDate;
        this.user = null;
    }
}

const findAll = async () => {
    let sql = `
        SELECT TITLE      TITLE
             , CONTENT    CONTENT
             , INPUT_TIME INPUTTIME
        FROM DEV_COMMENTS
    `;

    let rows = await dbConfig.select(sql);
    if (rows.length === 0) {
        return null;
    }
    let commentList = rows.map(row => new Comment(row.title, row.content, row.inputTime));
    return commentList;
}

const save = async comments => {
    let userKey = await User.findKeyById(comments.user.id).then;
    let sql = `
        INSERT INTO DEV_COMMENTS(TITLE, CONTENT, DEL_FLAG, UPD_USER_KEY, INPUT_TIME)
        VALUES (?, ?, 'N', ?, NOW())
    `;
    await dbConfig.insert(sql, [comments.title, comments.content, userKey]);
}

module.exports = {
    Comment,
    save,
    findAll,
}
