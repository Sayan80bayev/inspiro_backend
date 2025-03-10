const express = require('express');
const {
  createPost,
  updatePost,
  posts,
} = require('../controllers/postController'); // Убедитесь, что этот импорт правильный
const authValidator = require('../middlewares/authValidator');

const router = express.Router();

router.get('/', posts);
router.post('/', authValidator, createPost);
router.put('/:id', authValidator, updatePost);

module.exports = router;
