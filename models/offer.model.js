const mongoose = require("mongoose");

const offers = mongoose.Schema({
  employerId: {
    type: String,
    required: true,
  },
  employerType: {
    type: String,
    trim: true,
    default: "",
  },
  employerField: {
    type: String,
    trim: true,
    default: "",
  },
  title: {
    type: String,
    trim: true,
    required: true,
    default: "",
  },
  city: {
    type: String,
    trim: true,
    default: "",
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
});

const trainingOfficeModal = mongoose.model("offers", offers);

module.exports = trainingOfficeModal;
