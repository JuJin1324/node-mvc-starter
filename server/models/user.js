const dbConfig = require('../config/dbconfig');
const bcrypt = require('bcrypt-nodejs');

class User {
    constructor(id, password, name, phone, email) {
        this.id = id;
        this.password = password;
        if (name) this.name = name;
        if (phone) this.phone = phone;
        if (email) this.email = email;
    }

    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

exports.findById = async (id) => {
    let sql = `
        SELECT UR.USER_ID  'id'
             , PW.PASSWORD 'password'
             , UR.NAME     'name'
             , UR.PHONE    'phone'
             , UR.EMAIL    'email'
        FROM DEV_USER UR,
             DEV_PASSWORD PW
        WHERE UR.USER_ID = ?
          AND UR.DEL_FLAG = 'N'
          AND PW.USER_KEY = UR.USER_KEY
          AND PW.DEL_FLAG = 'N'
    `;

    let rows = await dbConfig.select(sql, [id]);
    if (!rows[0]) {
        return null;
    }

    return new User(
        rows[0].id,
        rows[0].password,
        rows[0].name,
        rows[0].phone,
        rows[0].email
    );
};

exports.save = async user => {
    await saveUser(user);
    await savePassword(user);
};

const saveUser = async user => {
    let insertUserSql = `
        INSERT INTO DEV_USER(USER_ID, NAME, PHONE, EMAIL, STATUS, COMMENT, DEL_FLAG, UPD_USER_KEY)
            VALUE (?, ?, ?, ?, 'A', NULL, 'N', 1)
    `;
    await dbConfig.insert(insertUserSql, [user.id, user.name, user.phone, user.email]);
}

const savePassword = async user => {
    const userKey = await findKeyById(user.id);

    let insertPasswordSql = `
        INSERT INTO DEV_PASSWORD(USER_KEY, PASSWORD, PWD_STATUS, DEL_FLAG, UPD_USER_KEY)
        VALUES (?, ?, 'I', 'N', ?)
    `;
    await dbConfig.insert(insertPasswordSql, [userKey, user.password, userKey]);
}

exports.findKeyById = async id => {
    let sql = `
        SELECT USER_KEY 'userKey'
        FROM DEV_USER
        WHERE USER_ID = ?
    `;

    let rows = await dbConfig.select(sql, [id]);
    if (!rows[0]) {
        return null;
    }

    return rows[0].userKey;
};

module.exports = {
    User,
}
