const express = require("express");
const cors = require("cors");
const app = express();
const usersRouter = require("./routes/usersRouter");
const consultantRouter = require("./routes/consultantRouter");
const trainingOfficeRouter = require("./routes/trainingOfficeRouter");
const companyRouter = require("./routes/companyRouter");

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/consultants", consultantRouter);
app.use("/api/v1/trainingoffices", trainingOfficeRouter);
app.use("/api/v1/companies", companyRouter);

module.exports = app;
