const mongoose = require("mongoose");

const Review = mongoose.Schema({
  reviewerId: String,
  reviewerType: String,
  reviewerField: String,
  comment: String,
  rating: {
    type: Number,
    max: [5, "rating have to below 5"],
    min: [1, "rating have to be above 0"],
  },
});

module.exports = Review;
