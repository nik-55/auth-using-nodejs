const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models/userModel");

const register = async (req, res) => {
  try {
    const { email, password: plainTextPassword, username } = req.body;
    if (username?.length < 5 || username?.length > 18) {
      res.status(400).send({ status: "error", message: "Username should not be too short or too long" });
      return;
    }
    const result = await User.find({ email: email });
    if (result.length !== 0) {
      res.status(409).send({ status: "error", message: "Email already exist" });
      return;
    }

    const password = await bcrypt.hash(plainTextPassword, 10);
    const newuser = new User({
      email,
      password,
      username
    });
    const error = newuser.validateSync();
    if (error) throw error;
    newuser.save();
    res.send({ status: "ok", message: "User registered successfully" });
  } catch {
    res.status(500).send({ status: "error", message: "Error occured in processing the request" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password: plainTextPassword } = req.body;
    const result = await User.find({ email: email });
    if (result.length === 0) {
      res
        .status(403)
        .send({ status: "error", message: "Incorrect Credentials" });
      return;
    }
    const user = result[0];
    const check = await bcrypt.compare(plainTextPassword, user.password);
    if (!check) {
      res
        .status(403)
        .send({ status: "error", message: "Incorrect Credentials" });
      return;
    }
    // signing a token for around 5 min
    const jwt_token = jwt.sign(
      { email, exp: Math.floor(Date.now() / 1000) + 60 * 5 },
      process.env.SECRET_KEY_JWT
    );

    await User.updateOne({ email }, { $set: { jwt_token } })

    res.send({
      status: "ok",
      message: "User logged in success",
      jwt_token: jwt_token,
    });
  } catch {
    res.status(500).send({ status: "error", message: "Error occured in processing the request" });
  }
};

// Erasing token from database
const logout = async (req, res) => {
  try {
    await User.updateOne({ email: req.user.email }, { $unset: { jwt_token: "" } })
    res.send({ status: "ok", message: "Logout successfully" })
  } catch {
    res.status(500).send({ status: "error", message: "Error occured in processing the request" });
  }
}

module.exports = { register, login, logout };
