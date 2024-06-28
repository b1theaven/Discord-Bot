const mongoose = require('mongoose')
const { mongodburl } = require("./config.json")

module.exports = async () => {
  await mongoose.connect(mongodburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  return mongoose
}