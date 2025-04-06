const Comment = require('../models/Comment');
const Pin = require('../models/Pin'); // <-- you need this

// Create a new comment
exports.createComment = async ({ text, pin_id, user_id }) => {
  try {
    const newComment = new Comment({
      text,
      pin_id,
      user_id,
    });

    // Save the comment
    const savedComment = await newComment.save();

    // Push the comment into the Pin's comments array
    await Pin.findByIdAndUpdate(pin_id, {
      $push: { comments: savedComment._id },
    });

    return savedComment;
  } catch (error) {
    throw new Error('Error saving the comment: ' + error.message);
  }
};
// Get all comments for a specific pin
exports.getCommentsForPin = async (pin_id) => {
  try {
    const comments = await Comment.find({ pin_id })
      .populate('user_id', 'email') // Populate the user info (email)
      .populate('pin_id', 'title'); // Populate the pin info (title)
    return comments;
  } catch (error) {
    throw new Error('Error retrieving comments: ' + error.message);
  }
};
