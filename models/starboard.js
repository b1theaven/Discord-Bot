const { Schema, model } = require('mongoose')

let msg = new Schema({
  guild: String,
  channel: String,
  count: Number
})

module.exports = model('starboard', msg)