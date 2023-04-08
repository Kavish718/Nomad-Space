const ExpressError = require("./utils/ExpressError");
const CoworkingSpace = require("./models/coworkingSpace");
const Review = require("./models/reviews");
const { coworkingSpaceSchema, reviewSchema } = require("./schemas.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};


module.exports.validatecoworkingSpace = (req, res, next) => {
    const { error } = coworkingSpaceSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const coworkingSpace = await CoworkingSpace.findById(id);

    if (!(coworkingSpace.author.equals(req.user._id))) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/coworkingSpaces/${id}`);
    }

    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!(review.author.equals(req.user._id))) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/coworkingSpaces/${id}`);
    }

    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}