const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour has to have a name'],
      unique: true,
      trim: true,
      minlenght: [10, 'A tour has to have more or equal to 10 chars'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour has to have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour has to have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour has to have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty has to be from list [easy, medium, difficult]',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour rating has to be at least 1'],
      max: [5, 'A tour rating has to be at max rating of 5'],
    },
    ratingsQuantity: {
      type: Number,
      deafult: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour has to have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) cant be more than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour has to have description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour has to have cover img'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual element in app not in DB
// tourSchema.virtual('durrationWeeks').get(function () {
//   return this.duration / 7;
// });
// Before save (save, create)
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE only for time for querry
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
//   next();
// });

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Querry took: ${Date.now() - this.start} miliseconds`);
//   next();
// });

// AGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
