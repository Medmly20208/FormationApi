const mongoose = require("mongoose");

const Reviews = mongoose.Schema({
  reviewerId: String,
  reviewerType: String,
  reviewerField: String,
  comment: String,
  rating: Number,
});

const trainingOffice = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  trainingOfficeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },

  img: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  field: {
    type: String,
    trim: true,
  },
  aboutUs: {
    type: String,
    trim: true,
  },

  reviews: [Reviews],
});

const trainingOfficeModal = mongoose.model("training_office", trainingOffice);

module.exports = trainingOfficeModal;
