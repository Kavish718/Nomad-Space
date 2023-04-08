const mongoose = require("mongoose");
const CoworkingSpace = require("../models/coworkingSpace");
const Places = require("../models/places");

const cities = require("./cities");
const ranked = require("./ranked");
const images = require("./images");
const { descriptors, places } = require("./seedHelpers");

// const {createClient} = require('pexels');

// const client = createClient('563492ad6f917000010000019a03bc50279147c4a40018c199bb627a');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");  
const mapBoxToken = "pk.eyJ1IjoiZG90dmlnbmVzaCIsImEiOiJja3QxYTd2MDEwOGVsMm5vOGN2bzRhanFsIn0.3H4_qb3jEvliN-mdRya90A";
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

mongoose.connect('mongodb://127.0.0.1:27017/nomad-space', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error!"));
db.once("open", () => {
    console.log("Database connected!");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async () => {

    await CoworkingSpace.deleteMany({});
    await Places.deleteMany({});

    for (let i = 0; i < ranked.length; i++) {
        let rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const geoData = await geocoder.forwardGeocode({
            query: `${ranked[i].city}`,
            limit: 1,
        }).send();

        const camp = new CoworkingSpace({
            author: "6296e49529110b6a60208ffa",
            location: `${ranked[i].city}, ${ranked[i].country}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "http://source.unsplash.com/collection/484351",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut animi unde est excepturi culpa consequuntur dolores quia expedita adipisci repudiandae. Necessitatibus, fugiat dolorum et sapiente optio cupiditate nemo. Repudiandae, doloribus.",
            price: price,
            geometry: geoData.body.features[0].geometry,
            images: [
                {
                    url: 'https://res.cloudinary.com/daivqdxkr/image/upload/v1630230467/Yelpcamp/le8un1zmsnygtz3lfchl.jpg',
                    filename: 'Yelpcamp/le8un1zmsnygtz3lfchl'
                },
                {
                    url: 'https://res.cloudinary.com/daivqdxkr/image/upload/v1630230468/Yelpcamp/hkvelxaaautwmbiwtx20.jpg',
                    filename: 'Yelpcamp/hkvelxaaautwmbiwtx20'
                }
            ],
        });

        await camp.save();

        // const query = `${ranked[i].city}`;
        // let url;
        // client.photos.search({ query, per_page: 1 }).then(photos => {
        //     url = photos.photos[0].src.medium;
        //     console.log(photos.photos[0].src.medium);
        // });


        const place = new Places({
            city: `${ranked[i].city}`,
            country: `${ranked[i].country}`,
            imageUrl: images[i],
            overall: ranked[i].overall,
            cost:ranked[i].cost,
            internet: ranked[i].internet,
            fun: ranked[i].fun,
            safety: ranked[i].safety,
        });

        await place.save();

    }

}

seedDb().then(() => {
    mongoose.connection.close();
});
