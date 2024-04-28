// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Datest = require('./test');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    test: {
      type: mongoose.Schema.ObjectId,
      ref: 'tests',
      required: [true, 'Review must belong to a test.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tests',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;