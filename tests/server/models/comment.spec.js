const assert = require('chai').assert;
const dbConfig = require('../../../server/config/dbconfig');
const models = require('../../../server/models/raw');

describe('findAll', () => {
    before(() => {
        dbConfig.initDbPool('development');
    });

    it('should exist value when ID is valid.', (done) => {
        models.comment.findAll().then(commentList => {
            let englishComment = commentList[0];
            assert.equal(englishComment.title, 'test title1');
            assert.equal(englishComment.content, 'test content1');
            assert.equal(englishComment.userId, 'test1');

            let koreanComment = commentList[1];
            assert.equal(koreanComment.title, '한글 타이틀1');
            assert.equal(koreanComment.content, '한글 컨텐트1');
            assert.equal(koreanComment.userId, 'test2');

            done();
        });
    });
});

/* save 기능이 정상 동작에 대한 확인 및 삭제 처리가 현재로서는 필요 없음으로 save 테스트는 가능해질 때 까지 넘어간다. */
// describe('save', () => {
    // let comment;
    //
    // before(() => {
    //     dbConfig.initDbPool('development');
    //     comment = new Comment.Comment(
    //         '새로운 제목',
    //         '새로운 내용',
    //         null,
    //         'test1'
    //     );
    // });
    //
    // it('should be found when a user saving is OK.', (done) => {
    //     assert.doesNotThrow(() => {
    //         Comment.save(comment).then(() => {
    //             done();
    //         });
    //     });
    // });
    //
    // after(async () => {
    //     /* Delete Saved Comment */
    //     const conn = await dbConfig.getConnection();
    //     try {
    //         const deletePasswordQuery
    //             = 'DELETE FROM DEV_COMMENT WHERE COMMENT_KEY = ?`;
    //         await conn.query(deletePasswordQuery, [user.id]);
    //     } finally {
    //         await conn.end();
    //     }
    // });
// });
