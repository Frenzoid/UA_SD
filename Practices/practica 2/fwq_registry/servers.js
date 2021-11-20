const express = require('express');
const boom = require('express-boom');
const logger = require('morgan');
const cors = require('cors');

const app = express();
// Error standarization.
app.use(boom());

// Body parser configuration
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

// Logger to console.
app.use(logger("dev"));

// Enable cors
app.use(cors());

const http = require('http');
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: { origin: "*", }
});

module.exports = { server, io, app }