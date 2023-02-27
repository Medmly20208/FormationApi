const express = require("express");
const cors = require("cors");
const app = express();
const usersRouter = require("./routes/users");

app.use(express.json());
app.use(cors());

app.use("/api/v1/users", usersRouter);

module.exports = app;
