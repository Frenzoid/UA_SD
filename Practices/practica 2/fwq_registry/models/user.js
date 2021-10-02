/**
 * User model.
 */
const Sequelize = require('sequelize');
const sequelize = require('../bd-connector');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    x_actual: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    y_actual: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    x_destino: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    y_destino: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = User;