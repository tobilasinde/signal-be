/*************************************************************************
TOKEN TABLE
*************************************************************************/

module.exports = function(sequelize, Sequelize) {
    var Token = sequelize.define('token', {
        RefreshToken: {
            type: Sequelize.STRING,
            field: 'refreshToken'
        },
        UID: {
            type: Sequelize.STRING,
            field: 'uid'
        },
        KeysHash: {
            type: Sequelize.STRING,
            field: 'hash'
        }
        
    }, {
        freezeTableName: true
    });
    return Token;
}