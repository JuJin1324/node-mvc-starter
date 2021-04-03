const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const Password = require('./password');

class User extends Sequelize.Model {
    static init(sequelize, options) {
        return super.init({
            userKey: {
                field: 'USER_KEY',
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            id: {
                field: 'USER_ID',
                type: Sequelize.STRING(256),
                allowNull: false,
                uniqueKey: true,
            },
            name: {
                field: 'NAME',
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            phone: {
                field: 'PHONE',
                type: Sequelize.STRING(20),
            },
            email: {
                field: 'EMAIL',
                type: Sequelize.STRING(60),
            },
            comment: {
                field: 'COMMENT',
                type: Sequelize.STRING(2000),
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
            modelName: 'user',
            tableName: 'DEV_USER',
            paranoid: false,    /* true 로 설정하면 deletedAt 컬럼이 생긴다. 삭제시 완전히 지워지지 않고 deletedAt에 지운시각이 기록된다. */
            charset: 'UTF8MB4', /* 이모티콘까지 입력되게하려면 utf8mb4와 utf8mb4_general_ci 로 입력한다. */
            collate: 'UTF8MB4_GENERAL_CI',
        });
    }

    static associate(db) {
        db.User.hasOne(db.Password, {foreignKey: 'userKey', sourceKey: 'userKey'});
    }

    static async findById(id) {
        const user = await User.findOne({
            include: [
                {
                    model: Password,
                    attributes: ['password'],
                    required: true  /* INNER JOIN */
                }
            ],
            where: {
                id: id,
                delFlag: 'N',
            },
        });

        return user ? {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            password: user.password.password,
        } : null;
    }

    static save(user) {
        user.delFlag = 'N';
        user.updUserKey = 1;
        user.inputTime = new Date();

        return user.save();
    }

    static async findKeyById(id) {
        let user = await User.findOne({
            where: {
                id: id
            },
            raw: true
        });
        return user ? user.userKey : null;
    }

    static comparePassword(raw, encrypted) {
        return bcrypt.compareSync(raw, encrypted);
    }
}

module.exports = User;
