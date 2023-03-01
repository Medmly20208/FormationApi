const trainingOfficeModel = require("../models/trainingOffice.model");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files/profileImgTrainingOffice");
  },
  filename: (req, file, cb) => {
    const filename = `trainingoffice_${Date.now()}_${Math.round(
      Math.random() * 100
    )}${file.originalname}`;

    cb(null, filename);
  },
});

exports.upload = multer({ storage }).single("profileImg");

exports.updateTrainingOffice = (req, res) => {
  req.body.profileImg = req.file.filename;
  trainingOfficeModel
    .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
    .then((trainingOffice) => {
      res.status(200).json({
        status: "success",
        data: trainingOffice,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.getAllTrainingOffices = (req, res) => {
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const regex = new RegExp(req.query.name, "i"); // i for case insensitive
  queryObj["name"] = { $regex: regex };
  trainingOfficeModel
    .find(queryObj)
    .then((trainingOffices) => {
      res.status(200).json({
        status: "success",
        data: trainingOffices,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
      });
    });
};

exports.getTrainingOfficeById = (req, res) => {
  trainingOfficeModel
    .findById(req.params.id)
    .then((trainingOffice) => {
      res.status(200).json({
        status: "success",
        data: trainingOffice,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.deleteTrainingOfficeById = (req, res) => {
  trainingOfficeModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({
        status: "success",
        data: null,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.getAllReviews = (req, res) => {
  trainingOfficeModel
    .findById(req.params.id)
    .then((trainingOffice) => {
      res.status(200).json({
        status: "success",
        data: trainingOffice === null ? [] : trainingOffice.reviews,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.postReview = async (req, res) => {
  try {
    const trainingOffice = await trainingOfficeModel.findById(req.params.id);

    trainingOffice.reviews.push(req.body.review);
    trainingOffice.numberOfReviews = trainingOffice.numberOfReviews + 1;
    trainingOffice.totalRating =
      trainingOffice.totalRating + req.body.review.rating;

    trainingOffice.rating =
      trainingOffice.totalRating / trainingOffice.numberOfReviews;

    trainingOffice.save();

    res.status(200).json({
      status: "success",
      data: trainingOffice,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
