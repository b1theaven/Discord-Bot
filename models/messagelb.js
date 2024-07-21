const { Schema, model } = require('mongoose')

let msg = new Schema({
  guild: String,
  Messages: Number,
  id: String
})

module.exports = model('messageLeaderboard', msg)