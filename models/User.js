/*************************************************************************
USER TABLE
*************************************************************************/

module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define('User', {
        Email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            },
            field: 'email'
        },
        Password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        UserName: {
            type: Sequelize.STRING,
            field: 'userName'
        },
        FullName: {
            type: Sequelize.STRING,
            field: 'fullName'
        },
        Status: {
            type: Sequelize.ENUM('0','1'),
            defaultValue: '1',
            field: 'status'
        },
        ProfilePicURL: {
            type: Sequelize.STRING,
            field: 'profilePicURL'
        }
    }, {
        freezeTableName: true,
        panaroid: true
    });

    User.associate = function(models) {
        models.User.hasOne(models.Media, {onDelete: 'cascade'});
    };
    return User;
}