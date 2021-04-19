const assert = require('chai').assert;
const dbConfig = require('../../../server/config/dbconfig');
const bcrypt = require('bcrypt-nodejs');

const env = 'development';
let dbOptions = dbConfig.getDbOptions(env);
let models, initDbPool;
switch (dbOptions.model) {
    case 'raw':
        models = require('../../../server/models/raw');
        initDbPool = () => {
            dbConfig.initDbPool(env);
        };
        break;
    case 'sequelize':
        models = require('../../../server/models/sequelize');
        break;
}

describe('findById', () => {
    beforeEach(() => {
        if (initDbPool) initDbPool();
    });

    it('should exist value when ID is valid.', (done) => {
        models.User.findById('test1').then(user => {
            assert.equal(user.id, 'test1');
            assert.isTrue(models.User.comparePassword('1234', user.password));
            assert.equal(user.name, '홍길동');
            assert.equal(user.phone, '010-1234-1234');
            assert.equal(user.email, 'test1@gmail.com');
            done();
        });
    });

    it('should be null when ID is invalid.', (done) => {
        models.User.findById('invalid_ID').then(user => {
            assert.isNull(user);
            done();
        });
    });
});

describe('findKeyById', () => {
    beforeEach(() => {
        if (initDbPool) initDbPool();
    });

    it('should exist value when ID is valid.', (done) => {
        models.User.findKeyById('test1').then(key => {
            assert.equal(key, '1');
            done();
        });
    });

    it('should be null when ID is invalid.', (done) => {
        models.User.findKeyById('invalid_ID').then(key => {
            assert.isNull(key);
            done();
        });
    });
});

describe('save', () => {
    let user;

    beforeEach(() => {
        if (initDbPool) initDbPool();
        switch (dbOptions.model) {
            case 'raw':
                user = new models.User(
                    'test100',
                    bcrypt.hashSync('1234', bcrypt.genSaltSync(8), null),
                    '홍길자',
                    '010-7777-7777',
                    'test100@gmail.com'
                );
                break;
            case 'sequelize':
                user = models.User.build({
                    id: 'test100',
                    password: bcrypt.hashSync('1234', bcrypt.genSaltSync(8), null),
                    name: '홍길자',
                    phone: '010-7777-7777',
                    email: 'test100@gmail.com',
                });
                break;
        }
    });

    it('should be found when a user saving is OK.', (done) => {
        models.User.save(user).then(() => {
            models.User.findById(user.id).then(user => {
                assert.equal(user.id, 'test100');
                // assert.isTrue(user.validPassword('1234'));
                assert.equal(user.name, '홍길자');
                assert.equal(user.phone, '010-7777-7777');
                assert.equal(user.email, 'test100@gmail.com');
                done();
            });
        }).catch(err => {
            console.log(err);
        });
    });

    after(async () => {
        switch (dbOptions.model) {
            case 'raw':
                /* Delete Saved User and Password */
                const conn = await dbConfig.getConnection();
                try {
                    const deletePasswordQuery
                        = 'DELETE FROM DEV_PASSWORD WHERE USER_KEY = (SELECT USER_KEY FROM DEV_USER WHERE USER_ID = ?)';
                    await conn.query(deletePasswordQuery, [user.id]);

                    const deleteUserQuery = 'DELETE FROM DEV_USER WHERE USER_ID = ?';
                    await conn.query(deleteUserQuery, [user.id]);
                } finally {
                    await conn.end();
                }
                break;
            case 'sequelize':
                await user.destroy();
                break;
        }
    });
});
