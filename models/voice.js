const mongoose = require("mongoose")

let voice = new mongoose.Schema({
    user: String,
    channel: String,
    userLimit: Number,
    invisible: Boolean,
    lock: Boolean
})

module.exports = mongoose.model("voice", voice)