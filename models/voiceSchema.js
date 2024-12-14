const mongoose = require("mongoose")

const voiceSchema = new mongoose.Schema({
    guild: String,
    voice: String,
    category: String,
    userLimit: Number
})

module.exports = mongoose.model("voiceSchema", voiceSchema)