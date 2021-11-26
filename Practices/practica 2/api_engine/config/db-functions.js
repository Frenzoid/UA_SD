const User = require('../models/user');
const Atraccion = require('../models/atraccion');
const Log = require('../models/log');

async function runDBPreparations() {

    // Sync all models.
    await User.sync({ force: false });
    await Atraccion.sync({ force: false });
    await Log.sync({ force: false });
}

module.exports = runDBPreparations;