const mongoose = require("mongoose")

let afk = new mongoose.Schema({
    id: String,
    message: String,
    timestamp: Date
})

module.exports = mongoose.model("afk", afk)