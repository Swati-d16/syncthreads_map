const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Auto-increment field
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Auto-increment the "id" field
userSchema.plugin(AutoIncrement, { inc_field: "id" });

// Hash Password Before Saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
