const dbConfig = require('../config/dbconfig');
const User = require('./user');

class Comment {
    constructor(title, content, inputTime, userId) {
        this.title = title;
        this.content = content;
        this.inputTime = inputTime;
        this.userId = userId;
    }
}

exports.findAll = async () => {
    let sql = `
        SELECT CM.TITLE      'title'
             , CM.CONTENT    'content'
             , CM.INPUT_TIME 'inputTime'
             , UR.USER_ID    'userId'
        FROM DEV_COMMENTS CM
           , DEV_USER UR
        WHERE CM.DEL_FLAG = 'N'
          AND UR.USER_KEY = CM.UPD_USER_KEY
    `;

    let rows = await dbConfig.select(sql);
    if (rows.length === 0) {
        return null;
    }

    return rows.map(row => new Comment(row.title, row.content, row.inputTime, row.userId));
}

exports.save = async comments => {
    let userKey = await User.findKeyById(comments.user.id);
    let sql = `
        INSERT INTO DEV_COMMENTS(TITLE, CONTENT, DEL_FLAG, UPD_USER_KEY, INPUT_TIME)
        VALUES (?, ?, 'N', ?, NOW())
    `;
    await dbConfig.insert(sql, [comments.title, comments.content, userKey]);
}

module.exports = {
    Comment,
}
