const dbConfig = require('../config/dbconfig');

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

const query = (query, cb) => {
    dbConfig.getConnection().then(conn => {
        try {
            conn.query(query).then(rows => {
                cb(null, rows);
            });
        } catch (err) {
            cb(err, null);
        } finally {
            conn.end();
        }
    }).catch(err => {
        cb(err, null);
    });
}

const findById = (id, cb) => {
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

    query(sql, (err, rows) => {
        if (err) {
            cb(err, null);
        } else if (rows[0]) {
            cb(null, new User(rows[0].id, rows[0].password, rows[0].name, rows[0].phone, rows[0].email));
        } else {
            cb(new Error('해당 User가 테이블에 존재하지 않습니다.'), null);
        }
    });
};

const save = (user, cb) => {
    let sql = `
        INSERT INTO DEV_USER(USER_ID, NAME, PHONE, EMAIL, STATUS, COMMENT, DEL_FLAG, UPD_USER_KEY) 
        VALUE ('${user.id}', '${user.password}', '${user.phone}', '${user.email}', 'A', null, 'N', 1);
    `;
    query(sql, (err, rows) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

module.exports = {
    User,
    findById,
    save,
}
