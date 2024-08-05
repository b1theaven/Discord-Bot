const { model, Schema } = require("mongoose");
 
const schema = new Schema({
    role: String,
    guild: String,
    message: String,
    emoji: String,
});
 
module.exports = model("reactionrole", schema)