const CommentService = require('../services/commentService');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { text, pin_id } = req.body;
    const user_id = req.user.id; // Use the user ID from the authValidator middleware

    // Call the service to create a new comment
    const newComment = await CommentService.createComment({
      text,
      pin_id,
      user_id,
    });

    res
      .status(201)
      .json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating comment', error: error.message });
  }
};

// Get all comments for a specific pin
exports.getCommentsForPin = async (req, res) => {
  try {
    const { pin_id } = req.params;
    const comments = await CommentService.getCommentsForPin(pin_id);

    res.status(200).json({ comments });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving comments', error: error.message });
  }
};
