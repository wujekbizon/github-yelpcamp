const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

// https://res.cloudinary.com/dpnig0xon/image/upload/v1649592029/YelpCamp/viojoikwfd9cq5gfvn7c.avif

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { toJSON: { virtuals: true } }
);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <h5><a href="/campgrounds/${this._id}">${this.title}</a></h5>
  <p>${this.description.substring(0, 40)}...</p>
  <p>Coordinates: ${this.geometry.coordinates}</p>
  `;
});

CampgroundSchema.post('findOneAndRemove', async (campground) => {
  if (campground.reviews.length) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);