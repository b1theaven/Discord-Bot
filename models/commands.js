const mongoose = require("mongoose")

let Schema = new mongoose.Schema({
    Cmds: Array
})
module.exports = mongoose.model("command", Schema)