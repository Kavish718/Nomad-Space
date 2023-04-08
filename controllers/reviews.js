const CoworkingSpace = require("../models/coworkingSpace");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const coworkingSpace = await CoworkingSpace.findById(id);
    const review = new Review(req.body.review);

    review.author = req.user;
    coworkingSpace.reviews.push(review);
    await review.save();
    await coworkingSpace.save();

    req.flash("success", "Review successfully posted!");

    res.redirect(`/coworkingSpaces/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await CoworkingSpace.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(id);

    req.flash("success", "Review successfully deleted!");

    res.redirect(`/coworkingSpaces/${id}`);
}