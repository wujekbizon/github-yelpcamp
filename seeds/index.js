const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose
  .connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log('MONGO CONNECTION OPEN!!');
  })
  .catch((err) => {
    console.log('OH NO Mongo Conection Error');
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDataBase = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      // MY USER ID
      author: '62515fc367e1ddf25647566d',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel voluptate fugit numquam? Hic laboriosam, dolore consequuntur incidunt dicta, laudantium numquam impedit libero consequatur provident sequi minima, error nam repellendus explicabo.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dpnig0xon/image/upload/v1649588932/YelpCamp/bj5nh2wpto5jn5j3uzo5.avif',
          filename: 'YelpCamp/bj5nh2wpto5jn5j3uzo5',
        },
        {
          url: 'https://res.cloudinary.com/dpnig0xon/image/upload/v1649588932/YelpCamp/rprmfhij47lb6zfjov8d.avif',
          filename: 'YelpCamp/rprmfhij47lb6zfjov8d',
        },
        {
          url: 'https://res.cloudinary.com/dpnig0xon/image/upload/v1649588932/YelpCamp/nidtzbyprzkophxsrl7o.avif',
          filename: 'YelpCamp/nidtzbyprzkophxsrl7o',
        },
        {
          url: 'https://res.cloudinary.com/dpnig0xon/image/upload/v1649588932/YelpCamp/stnbgtffpndvn3gid27n.avif',
          filename: 'YelpCamp/stnbgtffpndvn3gid27n',
        },
        {
          url: 'https://res.cloudinary.com/dpnig0xon/image/upload/v1649588932/YelpCamp/fhadzgaodsk62zoeeukd.avif',
          filename: 'YelpCamp/fhadzgaodsk62zoeeukd',
        },
      ],
    });
    await camp.save();
  }
};

seedDataBase().then(() => {
  mongoose.connection.close();
});
