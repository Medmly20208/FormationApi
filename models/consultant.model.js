const mongoose = require("mongoose");

const Reviews = require("../schemas/review");

const consultant = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      deafult: "",
    },
    cv: {
      type: String,
      trim: true,
      default: "",
    },
    profileImg: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    field: {
      type: String,
      trim: true,
      default: "",
    },
    aboutMe: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: Array,
      default: [],
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    city: {
      type: String,
      default: "",
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    rating: { type: Number, default: 0 },
    reviews: {
      type: [Reviews],
      deafult: [],
    },
  },
  { timestamps: true }
);

const consultantModal = mongoose.model("consultant", consultant);

module.exports = consultantModal;
