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
  if (req.files["profileImg"][0]) {
    req.body.profileImg = req.files["profileImg"][0].filename;
  }
  if (req.files["cv"][0]) {
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

exports.getAllConsultants = (req, res) => {
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const regex = new RegExp(req.query.name, "i"); // i for case insensitive
  queryObj["name"] = { $regex: regex };
  consultant
    .find(queryObj)
    .select("profileImg name rating numberOfReviews field")
    .then((consultants) => {
      res.status(200).json({
        status: "success",
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

    consultantUser.reviews.push(req.body.review);
    consultantUser.numberOfReviews = consultantUser.numberOfReviews + 1;
    consultantUser.totalRating =
      consultantUser.totalRating + req.body.review.rating;

    consultantUser.rating =
      consultantUser.totalRating / consultantUser.numberOfReviews;

    consultantUser.save();

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
