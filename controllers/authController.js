const jwt = require("jsonwebtoken");
const user = require("../models/user.model");

const isUserAuthenticated = async (req) => {
  // check if the authorization token exists in the right form
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    throw new Error("you are not authorized to access this route.");
  }
  const token = req.headers.authorization.split(" ")[1];

  //  validate json
  if (!token) {
    throw new Error("you are not authorized to access this route");
  }

  const decoded = await jwt.verify(
    token,
    process.env.SECRET_JWT,
    (err, result) => {
      if (err) {
        throw new Error("you are not authorized");
      }
      return result;
    }
  );

  const freshUser = await user.findById(decoded._id);

  if (!freshUser) {
    throw new Error("the user belonging to this token doesn't longer exist");
  }
};

exports.checkIfUserAuthenticated = (req, res, next) => {
  isUserAuthenticated(req)
    .then((result) => {
      next();
    })
    .catch((err) => {
      res.status(401).json({
        status: "success",
        message: err.message,
      });
    });
};
