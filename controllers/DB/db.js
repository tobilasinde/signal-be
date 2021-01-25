/**
 * DB Layer module.
 * Author: Anthony Olasinde.
 * Version: 1.0.0
 * Release Date: 27-Dec-2020
 * Last Updated: 27-Dec-2020
 */

/**
 * Module dependencies.
 */
 
var fs = require("fs");
var path = require("path");
var Sequelize = require('sequelize');
var db = {};
// var sequelize = new Sequelize(process.env.db.database, process.env.db.username, process.env.db.password, process.env.db.sequelizeParams);
var sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    multipleStatements: true,
    dialect: process.env.DBDIALECT,
    logging: false,
    dialectOptions: {
        ssl: process.env.SSL
    }
});

const Op = Sequelize.Op
db.Op = Op
// load models

fs.readdirSync(__dirname + '/../../models')
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname + '/../../models', file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
//Sync Database
sequelize.sync().then(async function() {
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});
// exports
db.Sequelize = Sequelize;

module.exports = db;
