const Sequelize = require('sequelize');

class Password extends Sequelize.Model {
    static init(sequelize, options) {
        return super.init({
            userKey: {
                field: 'USER_KEY',
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            password: {
                field: 'PASSWORD',
                type: Sequelize.STRING(256),
                allowNull: false,
            },
            pwdStatus: {
                field: 'PWD_STATUS',
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            delFlag: {
                field: 'DEL_FLAG',
                type: Sequelize.CHAR,
                allowNull: false,
            },
            updUserKey: {
                field: 'UPD_USER_KEY',
                type: Sequelize.INTEGER,
            },
            inputTime: {
                field: 'INPUT_TIME',
                type: Sequelize.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,  /* true 로 하면 createdAt과 updatedAt을 생성한다. */
            underscored: true,  /* table column 명이 snake case 인 경우 true, camel case 인 경우 false */
            modelName: 'password',
            tableName: 'DEV_PASSWORD',
            paranoid: false,    /* true 로 설정하면 deletedAt 컬럼이 생긴다. 삭제시 완전히 지워지지 않고 deletedAt에 지운시각이 기록된다. */
            charset: 'UTF8MB4', /* 이모티콘까지 입력되게하려면 utf8mb4와 utf8mb4_general_ci 로 입력한다. */
            collate: 'UTF8MB4_GENERAL_CI',
        });
    }

    static associate(db) {
        db.Password.belongsTo(db.User, {foreignKey: 'userKey', targetKey: 'userKey'});
    }
}

module.exports = Password;
