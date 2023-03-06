const jwt = require("jsonwebtoken");

function createToken(_id, type) {
  return jwt.sign({ _id, type }, process.env.SECRET_JWT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

module.exports = createToken;
