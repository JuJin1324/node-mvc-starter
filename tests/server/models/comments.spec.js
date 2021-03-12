const assert = require('chai').assert;
const dbConfig = require('../../../server/config/dbconfig');
const Comments = require('../../../server/models/comment');

describe('findAll', () => {
    before(() => {
        dbConfig.initDbPool('development');
    });

    it('should exist value when ID is valid.', (done) => {
        Comments.findAll().then(commentsList => {

        });
        // User.findById('test1').then(user => {
        //     assert.equal(user.id, 'test1');
        //     assert.isTrue(user.validPassword('1234'));
        //     assert.equal(user.name, '홍길동');
        //     assert.equal(user.phone, '010-1234-1234');
        //     assert.equal(user.email, 'test1@gmail.com');
        //     done();
        // });
    });

    it('should be null when ID is invalid.', (done) => {
        // User.findById('invalid_ID').then(user => {
        //     assert.isNull(user);
        //     done();
        // });
    });
});
