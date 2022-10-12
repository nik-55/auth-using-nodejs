const vd = require("validator");
const jwt = require("jsonwebtoken");
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

const auth = (req, res, next) => {
  const authorization = req.headers.authorization;
  try {
    if (!authorization) {
      res.status(401).send("Unauthorized access");
      return;
    }
    const tokenArray = authorization.split(" ");
    if (!vd.isJWT(tokenArray[tokenArray.length - 1])) {
      res.status(401).send("Unauthorized access");
      return;
    }
    const jwt_token = tokenArray[tokenArray.length - 1];
    const result = jwt.verify(jwt_token, process.env.SECRET_KEY_JWT);
    // if verification failed then it throws error
    req.user = result;
    next();
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

module.exports = { validate, auth };
