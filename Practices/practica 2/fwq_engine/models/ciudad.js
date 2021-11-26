/**
 * User model.
 */
const Sequelize = require('sequelize');
const sequelize = require('../config/bd-connector');

const Ciudad = sequelize.define('ciudad', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    temperatura: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
});

module.exports = Ciudad;