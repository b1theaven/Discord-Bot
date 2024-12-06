const mongoose = require("mongoose")


const cusrole = new mongoose.Schema({
    roles: String,
    user: String,
    gift: Array,
    date: String,
    icon: String
})

module.exports = mongoose.model("customroles", cusrole)