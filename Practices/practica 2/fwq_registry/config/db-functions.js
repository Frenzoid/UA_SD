const Aforo = require('../models/aforo');
const User = require('../models/user');


async function runDBPreparations() {

    // Sync all models.
    await User.sync({ force: true });


    // await Aforo.sync({ force: true });
    // await Aforo.create({ aforo: 10 });
}

module.exports = runDBPreparations;