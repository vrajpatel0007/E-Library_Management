const express = require("express");
const routes = express.Router();
const userRoute = require("./user.route");
const bookRoute = require("./book.route");

routes.use("/user", userRoute);
routes.use("/book", bookRoute);

module.exports = routes;
