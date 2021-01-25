/*************************************************************************
ACCOUNT TABLE
*************************************************************************/

module.exports = function(sequelize, Sequelize) {
    var Media = sequelize.define('Media', {
        PublicId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'publicId'
        },
        Category: {
            type: Sequelize.STRING,
            field: 'category'
        },
        Tag: {
            type: Sequelize.STRING,
            field: 'tag'
        }
        
    }, {
        freezeTableName: true,
        panaroid: true
    });
    
    Media.associate = function(models) {
        models.Media.belongsTo(models.User, {onDelete: 'CASCADE'});
    };
    return Media;
}