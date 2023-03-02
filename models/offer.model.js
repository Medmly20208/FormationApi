const mongoose = require("mongoose");

const offers = mongoose.Schema(
  {
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
    employerName: {
      type: String,
      trim: true,
      default: "",
    },
    employerImage: {
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
    numberOfApplicants: {
      type: Number,
      trim: true,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const trainingOfficeModal = mongoose.model("offers", offers);

module.exports = trainingOfficeModal;
