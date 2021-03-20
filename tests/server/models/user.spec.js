const assert = require('chai').assert;
const dbConfig = require('../../../server/config/dbconfig');
const models = require('../../../server/models/raw');
const bcrypt = require('bcrypt-nodejs');

describe('findById', () => {
    before(() => {
        dbConfig.initDbPool('development');
    });

    it('should exist value when ID is valid.', (done) => {
        models.user.findById('test1').then(user => {
            assert.equal(user.id, 'test1');
            assert.isTrue(user.validPassword('1234'));
            assert.equal(user.name, '홍길동');
            assert.equal(user.phone, '010-1234-1234');
            assert.equal(user.email, 'test1@gmail.com');
            done();
        });
    });

    it('should be null when ID is invalid.', (done) => {
        models.user.findById('invalid_ID').then(user => {
            assert.isNull(user);
            done();
        });
    });
});

describe('findKeyById', () => {
    before(() => {
        dbConfig.initDbPool('development');
    });

    it('should exist value when ID is valid.', (done) => {
        models.user.findKeyById('test1').then(key => {
            assert.equal(key, '1');
            done();
        });
    });

    it('should be null when ID is invalid.', (done) => {
        models.user.findKeyById('invalid_ID').then(key => {
            assert.isNull(key);
            done();
        });
    });
});

describe('save', () => {
    let user;

    before(() => {
        dbConfig.initDbPool('development');
        user = new models.user.User(
            'test100',
            bcrypt.hashSync('1234', bcrypt.genSaltSync(8), null),
            '홍길자',
            '010-7777-7777',
            'test100@gmail.com'
        );
    });

    it('should be found when a user saving is OK.', (done) => {
        models.user.save(user).then(() => {
            models.user.findById(user.id).then(user => {
                assert.equal(user.id, 'test100');
                assert.isTrue(user.validPassword('1234'));
                assert.equal(user.name, '홍길자');
                assert.equal(user.phone, '010-7777-7777');
                assert.equal(user.email, 'test100@gmail.com');
                done();
            })
        });
    });

    after(async () => {
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
    });
});

describe('findKeyById', () => {
    it('should exist value when ID is valid.', (done) => {
        models.user.findKeyById('test1').then(key => {
            assert.equal(key, 1);
            done();
        });
    });

    it('should be null when ID is invalid.', (done) => {
        models.user.findKeyById('invalid_ID').then(key => {
            assert.isNull(key);
            done();
        });
    });
});
