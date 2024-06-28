const mongoose = require('mongoose')


const languageSchema = new mongoose.Schema({
  _id: String,
  language: String,
})

module.exports = mongoose.model('language', languageSchema)