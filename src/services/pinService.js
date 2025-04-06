const Pin = require('../models/Pin');

const ensureAuthenticated = (user) => {
  if (!user || !user.id) {
    throw new Error('Unauthorized: No user ID found');
  }
  return user.id;
};

const findPinById = async (post_id) => {
  const pin = await Pin.findOne({ _id: post_id });
  if (!pin) {
    throw new Error('Post not found');
  }
  return pin;
};

const verifyPinOwnership = (post, user_id) => {
  if (post.user_id.toString() !== user_id.toString()) {
    throw new Error('Unauthorized: User not allowed');
  }
};

const getPins = async () => await Pin.find();

const create = async (req) => {
  const { title, description, file_url } = req.body;
  const user_id = ensureAuthenticated(req.user);
  return await Pin.create({ title, description, file_url, user_id });
};

const update = async (req) => {
  const { title, description, file_url } = req.body;
  const pin_id = req.params.id;
  const user_id = ensureAuthenticated(req.user);

  const pin = await findPinById(pin_id);
  verifyPinOwnership(pin, user_id);

  return await Pin.findByIdAndUpdate(
    pin_id,
    { title, description, file_url },
    { new: true },
  );
};

const remove = async (req) => {
  const pin_id = req.params.id;
  const user_id = ensureAuthenticated(req.user);

  const pin = await findPinById(pin_id);
  verifyPinOwnership(pin, user_id);

  return await Pin.findByIdAndDelete(pin_id);
};

module.exports = { getPins, create, update, remove };
