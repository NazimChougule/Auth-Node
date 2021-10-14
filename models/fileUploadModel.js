module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define("file_uploads", {
    fileName: {
      type: Sequelize.STRING,
    },
    mimeType: {
      type: Sequelize.STRING,
    },
    originalFileName: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.STRING,
    },
  });

  return File;
};
