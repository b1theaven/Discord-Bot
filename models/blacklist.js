const mongoose = require("mongoose")

let Schema = new mongoose.Schema({
    id: Array
})
module.exports = mongoose.model("blacklist", Schema)