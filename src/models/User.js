const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Role: { type: String, default: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

let User = mongoose.model('User', UserSchema);
module.exports = User;
