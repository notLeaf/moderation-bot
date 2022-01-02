const mongoose = require('mongoose');

const modLogModel = mongoose.model(
    "modlogs",
    new mongoose.Schema({
        Guild: String,
        Channel: String,
    })
)

module.exports = modLogModel;