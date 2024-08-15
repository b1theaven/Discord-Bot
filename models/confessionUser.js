const { Schema, model } = require('mongoose')

let msg = new Schema({
  id: String,
  confessionID: String,
  blacklist: String
})

module.exports = model('confessUser', msg)