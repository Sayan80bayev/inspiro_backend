const express = require('express');
const multer = require('multer');
const {
  getPinById,
  createPin,
  updatePin,
  pins,
  deletePin,
} = require('../controllers/pinController');
const authValidator = require('../middlewares/authValidator');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

const router = express.Router();

router.get('/', pins);
router.post('/', authValidator, upload.single('image'), createPin);
router.put('/:id', authValidator, upload.single('image'), updatePin);
router.get('/:id', getPinById);
router.delete('/:id', authValidator, deletePin);

module.exports = router;
