const { Schema, model } = require("mongoose");

let msg = new Schema({
  guild: String,
  id: String,
  xp: Number,
  level: Number,
  cooldown: { type: Number, default: 0 },
});

module.exports = model("level", msg);
