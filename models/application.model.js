const mongoose = require("mongoose");

const applications = mongoose.Schema({
  applicantId: {
    type: String,
    required: true,
  },
  applicantType: {
    type: String,
    trim: true,
    default: "",
  },
  employerType: {
    type: String,
    trim: true,
    default: "",
  },
  employerId: {
    type: String,
    trim: true,
  },
  offerId: {
    type: String,
    trim: true,
    required: true,
    default: "",
  },
  comment: {
    type: String,
    trim: true,
    default: "",
  },
});

const trainingOfficeModal = mongoose.model("applications", applications);

module.exports = trainingOfficeModal;
