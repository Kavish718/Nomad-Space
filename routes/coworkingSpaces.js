const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const coworkingSpace = require("../models/coworkingSpace");
const { isLoggedIn, isAuthor, validatecoworkingSpace } = require("../middleware");
const coworkingSpaces = require("../controllers/coworkingSpaces");
const multer = require('multer')
const { storage } = require("../cloudinary")
const upload = multer({ storage })


router.route("/")
    .get(catchAsync(coworkingSpaces.index))
    .post(isLoggedIn, upload.array("image"), validatecoworkingSpace, catchAsync(coworkingSpaces.createCoworkingSpace));

router.get("/new", isLoggedIn, coworkingSpaces.renderNewForm);

router.route("/:id")
    .get(catchAsync(coworkingSpaces.showCoworkingSpace))
    .put(isLoggedIn, isAuthor, upload.array("image"), validatecoworkingSpace, catchAsync(coworkingSpaces.updateCoworkingSpace))
    .delete(isLoggedIn, isAuthor, catchAsync(coworkingSpaces.deleteCoworkingSpace));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(coworkingSpaces.renderEditForm));



module.exports = router;