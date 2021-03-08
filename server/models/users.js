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

const findById = (id, callback) => {
    let sql = `
        SELECT DU.USER_ID  id
             , DP.PASSWORD password
             , DU.NAME     name
             , DU.PHONE    phone
             , DU.EMAIL    email
        FROM DEV_USER DU,
             DEV_PASSWORD DP
        WHERE DU.USER_ID = '${id}'
          AND DP.USER_KEY = DU.USER_KEY
    `;

    dbConfig.query(sql, (err, rows) => {
        if (err) {
            callback(err, null);
        } else if (rows[0]) {
            callback(null, new User(rows[0].id, rows[0].password, rows[0].name, rows[0].phone, rows[0].email));
        } else {
            callback(null, null);
        }
    });
};

const save = (user, callback) => {
    let insertUserSql = `
        INSERT INTO DEV_USER(USER_ID, NAME, PHONE, EMAIL, STATUS, COMMENT, DEL_FLAG, UPD_USER_KEY) 
        VALUE ('${user.id}', '${user.name}', '${user.phone}', '${user.email}', 'A', null, 'N', 1);
    `;
    dbConfig.query(insertUserSql, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            findKeyById(user.id, (err, userKey) => {
                let insertPasswordSql = `
                    INSERT INTO DEV_PASSWORD(USER_KEY, PASSWORD, PWD_STATUS, DEL_FLAG, UPD_USER_KEY) 
                    VALUES (${userKey}, '${user.password}', 'I', 'N', ${userKey}); 
                `;
                dbConfig.query(insertPasswordSql, (err, rows) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            });
        }
    });
};

const findKeyById = (id, callback) => {
    let sql = `
        SELECT USER_KEY userKey
        FROM DEV_USER 
        WHERE USER_ID = '${id}'
    `;

    dbConfig.query(sql, (err, rows) => {
        if (err) {
            callback(err, null);
        } else if (rows[0]) {
            callback(null, rows[0].userKey);
        } else {
            callback(null, null);
        }
    });
};

module.exports = {
    User,
    findById,
    save,
    findKeyById,
}
