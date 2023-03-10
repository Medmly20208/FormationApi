const mongoose = require("mongoose");

const Review = mongoose.Schema({
  senderId: String,
  senderType: String,
  notificationType: {
    type: String,
    enum: {
      values: ["application", "review"],
      message: "type has to be either company,consultant or trainingOffice",
    },
  },
  comment: {
    type: String,
  },
});

module.exports = Review;
