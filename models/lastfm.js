const mongoose = require('mongoose');

const lastFmUserSchema = new mongoose.Schema({
  id: String,
  lastFmUsername: String
});

const LastFmUser = mongoose.model('LastFmUser', lastFmUserSchema);

module.exports = LastFmUser;