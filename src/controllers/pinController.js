const { validationResult } = require('express-validator');
const ps = require('../services/pinService');

exports.pins = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const pins = await ps.getPins();
    res.status(200).json(pins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createPin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const post = await ps.create(req);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const pin = await ps.update(req);
    res.status(201).json(pin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    await ps.remove(req);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
