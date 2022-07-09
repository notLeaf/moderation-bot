const mongoose = require("mongoose");

const modLogModel = mongoose.model(
    "modlogs",
    new mongoose.Schema({
        Guild: { type: String },
        Channel: { type: String },
        Enabled: { type: Boolean, default: false },
    })
);

module.exports = modLogModel;
