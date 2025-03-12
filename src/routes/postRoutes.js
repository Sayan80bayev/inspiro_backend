const express = require('express');
const {
  createPost,
  updatePost,
  posts,
  deletePost,
} = require('../controllers/postController'); // Убедитесь, что этот импорт правильный
const authValidator = require('../middlewares/authValidator');

const router = express.Router();

router.get('/', posts);
router.post('/', authValidator, createPost);
router.put('/:id', authValidator, updatePost);
router.delete('/:id', authValidator, deletePost);

module.exports = router;
