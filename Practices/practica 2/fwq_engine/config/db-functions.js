const Aforo = require('../models/aforo');
const Atraccion = require('../models/atraccion');

async function runDBPreparations() {

    // Sync all models.
    await Aforo.sync({ force: true });
    await Aforo.create({ aforo: Number(process.env.AFORO || process.argv[2]) });

    await Atraccion.sync({ force: true });
    console.log("Aforo setteado", Number(process.env.AFORO || process.argv[2]), ", tabla de atracciones creadas");
}

module.exports = runDBPreparations;