const mongoose = require("mongoose");

const Applications = mongoose.Schema({
  applicantrId: String,
  applicantType: String,
  comment: String,
});

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

  title: {
    type: String,
    trim: true,
    default: "",
  },
  city: {
    type: String,
    trim: true,
    default: "",
  },

  applications: {
    type: [Applications],
    default: [],
  },
});

const trainingOfficeModal = mongoose.model("offers", offers);

module.exports = trainingOfficeModal;
