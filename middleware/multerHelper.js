const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.slice(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, `${Date.now()}${ext}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter }).single(
  "files"
);

module.exports = {
  uploadFile,
};
