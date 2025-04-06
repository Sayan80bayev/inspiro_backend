const express = require('express');

const router = express.Router();
const commentController = require('../controllers/commentController');
const authValidator = require('../middlewares/authValidator');

// Route to create a comment
router.post('/', authValidator, commentController.createComment);

// Route to get all comments for a specific pin
router.get('/:pin_id', commentController.getCommentsForPin);

module.exports = router;
