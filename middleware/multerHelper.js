const multer = require('multer');
let fs = require('fs-extra');

handleFileUpload = (req, res, next) => {
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      fs.mkdirsSync(__dirname + '/uploads/images'); // fs.mkdirsSync will create folders if it does not exist
      cb(null, __dirname + '/uploads/images');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  let upload = multer({ storage: storage }).single('photo');
  upload(req, res, (err) => {
    if (err) {
      res.send('somthing went wrong');
    }
    next();
  });
};

const multerHelper = {
  handleFileUpload: handleFileUpload,
};

module.exports = multerHelper;
