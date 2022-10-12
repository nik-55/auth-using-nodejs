const { User } = require("../db/models/userModel");
const profile = async (req, res) => {
  const email = req.user.email;
  const user = (await User.find({ email }))[0];
  res.send({ status: "ok", message: "We got you on database", data: user });
};
module.exports = { profile };
