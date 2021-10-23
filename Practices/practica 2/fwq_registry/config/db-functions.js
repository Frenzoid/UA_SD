const Aforo = require('../models/aforo');
const User = require('../models/user');


async function runDBPreparations() {

    // Sync all models.
    await User.sync({ force: true });
}

module.exports = runDBPreparations;