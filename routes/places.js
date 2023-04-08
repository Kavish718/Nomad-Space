const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const places = require("../controllers/places");


router.route("/")
    .get(catchAsync(places.index))

router.route("/find")
    .get(catchAsync(places.find))

router.route("/cost")
    .get(catchAsync(places.cost))

router.route("/internet")
    .get(catchAsync(places.internet))

router.route("/fun")
    .get(catchAsync(places.fun))

router.route("/safety")
    .get(catchAsync(places.safety))


module.exports = router;