const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  guild: String,
  prefix: String
})

module.exports = mongoose.model('prefix', Schema)