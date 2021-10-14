const models = require("../models");
const fs = require("fs");

exports.uploadFiles = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    const image = await models.file_uploads.create({
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      originalFileName: req.file.originalname,
      userId: req.userId,
    });
    if (image) {
      res.status(201).json({
        message: "File has been uploaded.",
        url:
          __basedir + "/resources/static/assets/uploads/" + req.file.filename,
      });
    }
  } catch (error) {
    return res.send(`Error when trying upload images: ${error}`);
  }
};
