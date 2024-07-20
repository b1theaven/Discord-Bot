const { Schema, model } = require('mongoose')

let msg = new Schema({
  guild: String,
  id: String,
  xp: Number,
  level: Number
})

module.exports = model('level', msg)