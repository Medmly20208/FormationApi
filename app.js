const express = require("express");
const cors = require("cors");
const app = express();
const usersRouter = require("./routes/usersRouter");
const consultantRouter = require("./routes/consultantRouter");

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/consultants", consultantRouter);

module.exports = app;
