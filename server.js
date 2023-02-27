const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const DB = process.env.MONGODB_URI;

mongoose.connect(DB).then(() => console.log("DB connect successfully"));

app.listen(5000, () => {
  console.log("connected 5000");
});
