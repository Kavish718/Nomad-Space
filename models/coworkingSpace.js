const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } }

const coworkingSpaceSchema = new Schema({
    title: {
        type: String
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
}, opts);

coworkingSpaceSchema.virtual("properties").get(function () {
    return {
        id: this._id,
        title: this.title,
        descr: this.description
    }
});

coworkingSpaceSchema.post("findOneAndDelete", async (coworkingSpace) => {
    if (coworkingSpace) {
        await Review.deleteMany({
            _id: {
                $in: coworkingSpace.reviews
            }
        });
    }
});

module.exports = mongoose.model("coworkingSpace", coworkingSpaceSchema);