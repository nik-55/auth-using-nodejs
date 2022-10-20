const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 5,
    maxLength: 18,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  jwt_token: String
});

const User = new mongoose.model("User", userSchema);
module.exports = { User };
