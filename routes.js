const { register, login, logout } = require("./views/Auth");
const { profile } = require("./views/Profile");
const { validate, auth } = require("./middleware/validateCredentials");
const routes = (app) => {
  app.post("/register", validate, register);
  app.post("/login", validate, login);
  app.get("/profile", auth, profile);
  app.get("/logout", auth, logout)
};

module.exports = { routes };
