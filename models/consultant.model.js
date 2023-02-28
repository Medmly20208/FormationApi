const mongoose = require("mongoose");

const Reviews = mongoose.Schema({
  reviewerId: String,
  reviewerType: String,
  reviewerField: String,
  comment: String,
  rating: Number,
});

const consultant = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  consultantId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  cv: {
    type: String,
    trim: true,
  },
  personnelImg: {
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
  aboutMe: {
    type: String,
    trim: true,
  },
  skills: {
    type: Array,
  },
  reviews: [Reviews],
});

const consultantModal = mongoose.model("consultant", consultant);

module.exports = consultantModal;
