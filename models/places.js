const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } }

const placesSchema = new Schema({
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    overall: {
        type: Number,
    },
    cost: {
        type: Number,
    },
    internet: {
        type: Number,
    },
    fun: {
        type: Number,
    },
    safety: {
        type: Number,
    },
}, opts);

placesSchema.virtual("properties").get(function () {
    return {
        id: this._id,
        title: this.title,
        descr: this.description
    }
});

module.exports = mongoose.model("places", placesSchema);