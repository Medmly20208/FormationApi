const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const usersRouter = require("./routes/usersRouter");
const consultantRouter = require("./routes/consultantRouter");
const trainingOfficeRouter = require("./routes/trainingOfficeRouter");
const companyRouter = require("./routes/companyRouter");
const offerRouter = require("./routes/offerRouter");
const applicationRouter = require("./routes/applicationRouter");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "you passed the limit for your IP,try in one hour!",
});

app.use(helmet());
app.use("/api", limiter);
app.use(express.static("./files"));
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/consultants", consultantRouter);
app.use("/api/v1/trainingoffices", trainingOfficeRouter);
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/offers", offerRouter);
app.use("/api/v1/applications", applicationRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(`this route ${req.originalUrl} doesn't exist on server`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
