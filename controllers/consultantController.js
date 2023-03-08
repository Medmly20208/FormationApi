const consultant = require("../models/consultant.model");
const multer = require("multer");
const excludeFromObject = require("../helpers/excludeFromObjects");
const UnauthorizedFields = require("../config/UnauthorizedFields");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImg") {
      cb(null, "./files/profileImgConsultant");
    } else {
      cb(null, "./files/cv");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "profileImg") {
      const filename = `consultantImg_${Date.now()}_${Math.round(
        Math.random() * 100
      )}${file.originalname}`;
      cb(null, filename);
    } else {
      const filename = `cv_${Date.now()}_${Math.round(Math.random() * 100)}${
        file.originalname
      }`;
      cb(null, filename);
    }
  },
});

exports.uploadFiles = multer({
  storage: storage,
  limits: {
    fileSize: "2mb",
  },
}).fields([
  {
    name: "profileImg",
    maxCount: 1,
  },
  {
    name: "cv",
    maxCount: 1,
  },
]);
exports.CreateConsultant = (req, res) => {
  consultant
    .create({ ...req.body })
    .then((consultant) => {
      res.status(200).json({
        status: "success",
        data: consultant,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.updateConsultant = (req, res) => {
  if (req.files?.profileImg[0]) {
    req.body.profileImg = req.files["profileImg"][0].filename;
  }
  if (req.files?.cv[0]) {
    req.body.cv = req.files["cv"][0].filename;
  }

  consultant
    .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
    .then((consultant) => {
      res.status(200).json({
        status: "success",
        data: consultant,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.aliasTopFiveConsultants = (req, res, next) => {
  req.query.sort = "-rating";
  req.query.page = "1";
  req.query.limit = "5";

  next();
};

exports.getAllConsultants = async (req, res) => {
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const regex = new RegExp(req.query.name, "i"); // i for case insensitive
  queryObj["name"] = { $regex: regex };

  //sort
  const querySort = !req.query.sort ? "-createdAt" : req.query.sort;

  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  if (req.query.page) {
    const numOfConsultants = await consultant.countDocuments();
    if (skip > numOfConsultants) {
      return res.status(200).json({
        status: "failed",
        message: "we don't have enough data",
      });
    }
  }

  consultant
    .find(queryObj)
    .select("profileImg name rating city field createdAt")
    .sort(querySort)
    .skip(skip)
    .limit(limit)
    .then((consultants) => {
      res.status(200).json({
        status: "success",
        results: consultants.length,
        data: consultants,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
      });
    });
};

exports.getConsultantById = (req, res) => {
  consultant
    .findById(req.params.id)
    .then((consultant) => {
      res.status(200).json({
        status: "success",
        data: consultant,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.deleteConsultantById = (req, res) => {
  consultant
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
  consultant
    .findById(req.params.id)
    .then((consultant) => {
      res.status(200).json({
        status: "success",
        data: consultant === null ? [] : consultant.reviews,
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
    const consultantUser = await consultant.findById(req.params.id);
    if (!consultantUser) {
      throw new Error("this user doesn't exist");
    }
    consultantUser.reviews.push(req.body.review);
    consultantUser.numberOfReviews = consultantUser.numberOfReviews + 1;
    consultantUser.totalRating =
      consultantUser.totalRating + req.body.review.rating;

    consultantUser.rating =
      consultantUser.totalRating / consultantUser.numberOfReviews;

    await consultantUser.save();

    res.status(200).json({
      status: "success",
      data: consultantUser,
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
    UnauthorizedFields.consultantUnauthorizedFields
  );

  next();
};
