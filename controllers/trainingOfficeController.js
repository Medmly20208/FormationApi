const trainingOffice = require("../models/trainingOffice.model");
const multer = require("multer");
const excludeFromObject = require("../helpers/excludeFromObjects");
const UnauthorizedFields = require("../config/UnauthorizedFields");

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
  console.log(req.body);
  if (req.body.profileImg) {
    req.body.profileImg = req.file.filename;
  }
  trainingOffice
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

exports.aliasTopFiveTrainingOffices = (req, res, next) => {
  req.query.sort = "-rating";
  req.query.page = "1";
  req.query.limit = "5";

  next();
};

exports.getAllTrainingOffices = async (req, res) => {
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const regex = new RegExp(req.query.name, "i"); // i for case insensitive
  queryObj["name"] = { $regex: regex };
  const querySort = !req.query.sort ? "-createdAt" : req.query.sort;

  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  if (req.query.page) {
    const numOfTrainingOffices = await trainingOffice.countDocuments();
    if (skip > numOfTrainingOffices) {
      return res.status(200).json({
        status: "failed",
        message: "we don't have enough data",
      });
    }
  }

  trainingOffice
    .find(queryObj)
    .select("profileImg name rating numberOfReviews city")
    .sort(querySort)
    .skip(skip)
    .limit(limit)
    .then((trainingOffices) => {
      res.status(200).json({
        status: "success",
        results: trainingOffices.length,
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
  trainingOffice
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
  trainingOffice
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
  trainingOffice
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
    const trainingOffice = await trainingOffice.findById(req.params.id);
    if (!trainingOffice) {
      throw new Error("this user doesn't exist");
    }
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

exports.excludeUnaouthorizedFields = (req, res, next) => {
  req.body = excludeFromObject(
    req.body,
    UnauthorizedFields.trainingOfficeUnauthorizedFields
  );

  next();
};
