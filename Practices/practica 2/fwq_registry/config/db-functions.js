const User = require('../models/user');


async function runDBPreparations() {

    // Sync all models.
    await User.sync({ force: false });
}

module.exports = runDBPreparations;