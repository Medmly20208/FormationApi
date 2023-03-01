const express = require("express");
const cors = require("cors");
const app = express();
const usersRouter = require("./routes/usersRouter");
const consultantRouter = require("./routes/consultantRouter");
const trainingOfficeRouter = require("./routes/trainingOfficeRouter");
const companyRouter = require("./routes/companyRouter");
const offerRouter = require("./routes/offerRouter");
const applicationRouter = require("./routes/applicationRouter");

app.use(express.static("./files"));
app.use(cors());
app.use(express.json());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/consultants", consultantRouter);
app.use("/api/v1/trainingoffices", trainingOfficeRouter);
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/offers", offerRouter);
app.use("/api/v1/applications", applicationRouter);

module.exports = app;
