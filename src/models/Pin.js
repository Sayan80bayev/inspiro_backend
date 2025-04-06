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
  },
  { timestamps: true },
);

module.exports = mongoose.model('Pin', PinSchema);
