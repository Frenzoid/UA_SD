const User = require('./models/user');


async function createTablesFromModels() {

    // Sync all models.
    await User.sync({ force: true });
}

module.exports = { createTablesFromModels };