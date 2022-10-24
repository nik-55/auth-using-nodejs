const vd = require("validator");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models/userModel")

const valid = (email, password) => {
  if (!vd.isLength(email, { min: 9 }) || !vd.isEmail(email))
    return { status: "error", code: 400, message: "Invalid email type" };
  if (!vd.isLength(password, { min: 6 }))
    return { status: "error", code: 400, message: "Invalid password type" };
  return { status: "ok" };
};

const validate = (req, res, next) => {
  const { email, password } = req.body;
  const check = valid(email, password);
  if (check.status === "error")
    res.status(check.code).send({ status: "error", message: check.message });
  else {
    next();
  }
};

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  try {
    if (!authorization) {
      res.status(400).send({ status: "error", message: "Authorization header not set" });
      return;
    }
    const tokenArray = authorization.split(" ");
    if (!vd.isJWT(tokenArray[tokenArray.length - 1])) {
      res.status(400).send({ status: "error", message: "Invalid token type" });
      return;
    }
    const jwt_token = tokenArray[tokenArray.length - 1];
    const result = jwt.verify(jwt_token, process.env.SECRET_KEY_JWT);
    // if verification failed then it throws error

    // checking if token sent is same as that was stored in database 
    // This is done to implement logout functionality
    const check = await User.find({ email: result.email, jwt_token: { $exists: true } })
    if (check.length === 0 || jwt_token !== check[0].jwt_token) {
      res.status(401).send({ status: "error", message: "Unauthorized access" });
      return
    }
    req.user = result;
    next();
  } catch (err) {
    let code = 500;
    let message = "error occured in processing the request"
    if (err?.message === "jwt expired") { code = 200; message = "session time out" }
    res.status(code).send({ status: "error", message });
  }
};

module.exports = { validate, auth };
