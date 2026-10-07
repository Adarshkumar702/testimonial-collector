const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Space name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Space slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    logo: {
      type: String,
      default: null
    },
    prompt: {
      type: String,
      default: 'Would you mind taking a minute to leave us a testimonial? Your feedback means a lot to us!'
    },
    requireAvatar: {
      type: Boolean,
      default: false
    },
    requireRating: {
      type: Boolean,
      default: true
    },
    customQuestions: [
      {
        type: String,
        trim: true
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Space', spaceSchema);
