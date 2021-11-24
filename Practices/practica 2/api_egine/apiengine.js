const express = require('express');
const boom = require('express-boom');
const logger = require('morgan');
const cors = require('cors');

const User = require("./models/user");
const Atraccion = require("./models/atraccion");
const Log = require('./models/log');

const sequelize = require('./config/bd-connector');
const runDBPreparations = require('./config/db-functions');


const app = express();

app.use(boom());

// Body parser configuration
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

// Logger to console.
app.use(logger("dev"));

// Enable cors
app.use(cors());

(async () => {


    // Nos logeamos en el servidor de bases de datos.
    await sequelize.authenticate();
    console.log("Sequelize: Successuflly authenticated.");

    // Realizamos las preparaciones previas en la base de datos (crear tablas etc..)
    await runDBPreparations();


    app.get('/atracciones', async (req, res) => {
        try {
            res.json(await Atraccion.findAll());
        } catch (err) {
            console.error("Error!", err);
            res.boom.badRequest("Error atacando la base de datos");
        }
    });

    app.get('/usuarios', async (req, res) => {
        try {
            res.json(await User.findAll());
        } catch (err) {
            console.error("Error!", err);
            res.boom.badRequest("Error atacando la base de datos");
        }
    });

    app.get('/logs', async (req, res) => {
        try {
            res.json(await Log.findAll());
        } catch (err) {
            console.error("Error!", err);
            res.boom.badRequest("Error atacando la base de datos");
        }
    });


    app.listen(Number(process.env.APIPORT) || 3003, () => {
        console.log("El servidor está inicializado en el puerto:", Number(process.env.APIPORT) || 3003);
    });

})();