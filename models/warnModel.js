const mongoose = require("mongoose");

module.exports = mongoose.model(
    "warnings",
    new mongoose.Schema({
        userId: { type: String },
        guildId: { type: String },
        moderatorId: { type: String },
        reason: { type: String },
        timestamp: { type: Number },
    })
);
