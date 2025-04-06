const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    file_url: { type: String },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Reference to the Comment model
      },
    ],
  },
  { timestamps: true },
);

PinSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

PinSchema.set('toObject', { virtuals: true });
PinSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Pin', PinSchema);
