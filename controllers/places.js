const Places = require("../models/places");
const CoworkingSpace = require("../models/coworkingSpace");

module.exports.index = async (req, res) => {
    const cities = await Places.find({});
    res.render("places/index", { cities });
}

module.exports.find = async (req, res) => {
    const coworkingSpaces = await CoworkingSpace.findOne({location: req.query.loc});
    console.log(coworkingSpaces._id);
    res.redirect(`/coworkingSpaces/${coworkingSpaces._id}`);
}

module.exports.cost = async (req, res) => {
    const cities = await Places.find({}).sort([['cost', -1]]);
    res.render("places/index", { cities });
}

module.exports.internet = async (req, res) => {
    const cities = await Places.find({}).sort([['internet', -1]]);
    res.render("places/index", { cities });
}

module.exports.fun = async (req, res) => {
    const cities = await Places.find({}).sort([['fun', -1]]);
    res.render("places/index", { cities });
}

module.exports.safety = async (req, res) => {
    const cities = await Places.find({}).sort([['safety', -1]]);
    res.render("places/index", { cities });
}