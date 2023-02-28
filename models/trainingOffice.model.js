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
    default: "",
  },

  img: {
    type: String,
    trim: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: "",
  },
  aboutUs: {
    type: String,
    trim: true,
    default: "",
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: [Reviews],
    default: [],
  },
});

const trainingOfficeModal = mongoose.model("training_office", trainingOffice);

module.exports = trainingOfficeModal;