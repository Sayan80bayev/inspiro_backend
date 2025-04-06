const mongoose = require('mongoose');

// Define the Comment Schema
const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true }, // The actual comment content
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    pin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pin', // Reference to the Pin model
      required: true,
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);

CommentSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { virtuals: true });
// Create the Comment model
module.exports = mongoose.model('Comment', CommentSchema);
