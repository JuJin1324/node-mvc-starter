const assert = require('chai').assert;
const dbConfig = require('../config/dbconfig');
const User = require('../models/users');

describe('findById', () => {
    before(async () => {
        dbConfig.initDbPool('development');
    });

    it('should exist value when ID is valid.', (done) => {
        User.findById('test1', (err, user) => {
            assert.equal(user.id, 'test1');
            assert.equal(user.password, '$2a$08$WYoceJIWZqK75uUFhZ81rO/O7FX8wIfcCxpJW.qci3iV/2C2gDvTC');    /* 1234 */
            assert.equal(user.name, '홍길동');
            assert.equal(user.phone,'010-1234-1234');
            assert.equal(user.email,'test1@gmail.com');
            done();
        });
    });

    it('should be null when ID is invalid.', (done) => {
        User.findById('invalid_ID', (err, user) => {
            assert.isNull(user);
            assert.isNotNull(err);
            assert.equal(err.message, '해당 User가 테이블에 존재하지 않습니다.');
            done();
        });
    });
});
