const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err.message));
