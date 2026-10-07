const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: true,
      index: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true
    },
    companyRole: {
      type: String,
      trim: true,
      default: ''
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Rating between 1 and 5 is required']
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true
    },
    avatar: {
      type: String,
      default: null
    },
    customAnswers: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: 'pending',
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    liked: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

testimonialSchema.index({ space: 1, status: 1, rating: -1, createdAt: -1 });
testimonialSchema.index(
  { customerName: 'text', customerEmail: 'text', companyRole: 'text', reviewText: 'text' },
  { weights: { customerName: 5, reviewText: 3, companyRole: 2, customerEmail: 1 } }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
