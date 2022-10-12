const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models/userModel");

const register = async (req, res) => {
  try {
    const { email, password: plainTextPassword } = req.body;
    const result = await User.find({ email: email });
    if (result.length !== 0) {
      res.status(403).send({ status: "error", message: "User already exist" });
      return;
    }

    const password = await bcrypt.hash(plainTextPassword, 10);
    const newuser = new User({
      email,
      password,
    });
    const error = newuser.validateSync();
    if (error) throw error;
    newuser.save();
    res.send({ status: "ok", message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password: plainTextPassword } = req.body;
    const result = await User.find({ email: email });
    if (result.length === 0) {
      res
        .status(404)
        .send({ status: "error", message: "Incorrect Credentials" });
      return;
    }
    const user = result[0];
    const check = await bcrypt.compare(plainTextPassword, user.password);
    if (!check) {
      res
        .status(404)
        .send({ status: "error", message: "Incorrect Credentials" });
      return;
    }
    // signing a token for around 1 hour
    const jwt_token = jwt.sign(
      { email, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      process.env.SECRET_KEY_JWT
    );
    res.send({
      status: "ok",
      message: "User logged in success",
      data: { jwt_token: jwt_token },
    });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};
module.exports = { register, login };
