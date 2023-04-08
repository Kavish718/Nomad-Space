const CoworkingSpace = require("../models/coworkingSpace");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const coworkingSpaces = await CoworkingSpace.find({});
    res.render("coworkingSpace/index", { coworkingSpaces });
}

module.exports.renderNewForm = (req, res) => {
    res.render("coworkingSpace/new");
}

module.exports.createCoworkingSpace = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.coworkingSpace.location,
        limit: 1,
    }).send();

    const coworkingSpace = new CoworkingSpace(req.body.coworkingSpace);
    coworkingSpace.geometry = geoData.body.features[0].geometry;
    coworkingSpace.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    coworkingSpace.author = req.user;
    await coworkingSpace.save();

    req.flash("success", "Successfully created a new coworking space!");

    res.redirect(`/coworkingSpaces/${coworkingSpace._id}`);

}

module.exports.showCoworkingSpace = async (req, res) => {
    const { id } = req.params;
    const coworkingSpace = await CoworkingSpace.findById(id).populate({
        path: "reviews",
        populate: "author"
    }).populate("author");

    if (!coworkingSpace) {
        req.flash("error", "Cannot find that coworking space!");
        return res.redirect("/coworkingSpaces");
    }

    res.render("coworkingSpace/show", { coworkingSpace });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const coworkingSpace = await CoworkingSpace.findById(id);

    if (!coworkingSpace) {
        req.flash("error", "Cannot find that coworking space!");
        return res.redirect("/coworkingSpaces");
    }

    res.render("coworkingSpace/edit", { coworkingSpace });
}

module.exports.updateCoworkingSpace = async (req, res) => {
    const { id } = req.params;

    const coworkingSpace = await CoworkingSpace.findByIdAndUpdate(id, { ...req.body.coworkingSpace });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    coworkingSpace.images.push(...imgs);
    await coworkingSpace.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await coworkingSpace.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(coworkingSpace);
    }

    req.flash("success", "Coworking Space successfully updated!");

    res.redirect(`/coworkingSpaces/${id}`);
}

module.exports.deleteCoworkingSpace = async (req, res) => {
    const { id } = req.params;

    await CoworkingSpace.findByIdAndDelete(id);

    req.flash("success", "Coworking Space successfully deleted!");

    res.redirect(`/coworkingSpaces`);
}