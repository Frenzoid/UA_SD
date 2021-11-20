const User = require('../models/user');
const Log = require('../models/log');

async function runDBPreparations() {

    // Sync all models.
    await User.sync({ force: true });
    await Log.sync({ force: true });
}

module.exports = runDBPreparations;