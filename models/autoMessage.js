const { Schema, model } = require("mongoose");

const autoMessageSchema = new Schema({
  guildId: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  trigger: { type: String, required: true },
  response: { type: String, required: true },
});

module.exports = model("AutoMessage", autoMessageSchema);
