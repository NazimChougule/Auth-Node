var express = require("express");
var models = require("./models");
var cors = require("cors");
var debug = require("debug");
var authRoute = require("./routes/authRoutes");
var userRoute = require("./routes/userRoutes");
var categoryRoute = require("./routes/categoryRoutes");
var productRoute = require("./routes/productRoutes");
var fileUploadRoute = require("./routes/fileUploadRoutes");

var app = express();
app.use(express.json());
app.use(cors());

var http = require("http");
var server = http.createServer(app);

var Role = models.roles;
global.__basedir = __dirname;

models.sequelize.sync().then(function () {
  server.listen("3000", function () {
    console.log(`Listening on port 3000`);
    debug("Express server listening on port " + server.address().port);
    createRoles();
  });
  server.on("listening", onListening);
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/upload", fileUploadRoute);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function createRoles() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
