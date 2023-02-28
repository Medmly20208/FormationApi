const mongoose = require("mongoose");

const consultant = mongoose.Schema({
  consultantId: String,
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  cv: {
    type: String,
    required: true,
    trim: true,
  },
  personnelImg: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  field: {
    type: String,
    required: true,
    trim: true,
  },
  aboutMe: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
  },
});

const consultantModal = mongoose.model("consultant", consultant);

module.exports = consultantModal;
