const express = require('express');
const {
  createPin: createPin,
  updatePin: updatePin,
  pins: pins,
  deletePin: deletePin,
} = require('../controllers/pinController'); // Убедитесь, что этот импорт правильный
const authValidator = require('../middlewares/authValidator');

const router = express.Router();

router.get('/', pins);
router.post('/', authValidator, createPin);
router.put('/:id', authValidator, updatePin);
router.delete('/:id', authValidator, deletePin);

module.exports = router;
