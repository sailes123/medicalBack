const multer = require("multer");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 'uploads/' is the directory where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname  }-${  Date.now()  }${file.originalname}`);
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Set allowed file types
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);

      return cb(new Error("Only .jpeg and .png files are allowed!"));
    }
  },
});

module.exports = upload;
