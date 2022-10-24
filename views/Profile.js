const { User } = require("../db/models/userModel");
const profile = async (req, res) => {
  try {
    const email = req.user.email;
    const user = (await User.find({ email }))[0];
    res.send({ status: "ok", message: "We got you on database", user: user });
  }
  catch {
    res.status(500).send({ status: "error", message: "Error occured in processing the request" })
  }
};
module.exports = { profile };
