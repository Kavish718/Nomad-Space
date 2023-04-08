const {createClient} = require('pexels');

const client = createClient('563492ad6f917000010000019a03bc50279147c4a40018c199bb627a');

// All requests made with the client will be authenticated
const query = 'Gran Canaria, Canary Islands';

client.photos.search({ query, per_page: 1 }).then(photos => {
    console.log(photos.photos[0].src.medium);
});
