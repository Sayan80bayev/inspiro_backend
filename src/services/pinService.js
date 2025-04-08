const Pin = require('../models/Pin');
const Comment = require('../models/Comment');
const cache = require('../utils/cache');

const ensureAuthenticated = (user) => {
  if (!user || !user.id) {
    throw new Error('Unauthorized: No user ID found');
  }
  return user.id;
};
const getPins = async () => {
  const cacheKey = 'all_pins';
  const cachedPins = cache.get(cacheKey);

  if (cachedPins) {
    console.log('[CACHE] Serving all pins from cache');
    return cachedPins;
  }

  const pins = await Pin.find();
  cache.set(cacheKey, pins);
  console.log('[DB] Fetched all pins from database');
  return pins;
};

const getPinById = async (pin_id) => {
  const cacheKey = `pin_${pin_id}`;
  const cachedPin = cache.get(cacheKey);

  if (cachedPin) {
    console.log(`[CACHE] Serving pin ${pin_id} from cache`);
    return cachedPin;
  }

  try {
    const pin = await Pin.findById(pin_id)
      .populate({
        path: 'user',
        model: 'User',
        select: 'email',
      })
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'user',
          model: 'User',
          select: 'email',
        },
      });

    if (!pin) throw new Error('Pin not found');

    cache.set(cacheKey, pin);
    console.log(`[DB] Fetched pin ${pin_id} from database`);
    return pin;
  } catch (error) {
    throw new Error('Error retrieving pin with comments: ' + error.message);
  }
};

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

  const updatedPin = await Pin.findByIdAndUpdate(
    pin_id,
    { title, description, file_url },
    { new: true },
  );

  // Invalidate caches
  cache.del(`pin_${pin_id}`);
  cache.del('all_pins');

  return updatedPin;
};

const remove = async (req) => {
  const pin_id = req.params.id;
  const user_id = ensureAuthenticated(req.user);

  const pin = await findPinById(pin_id);
  verifyPinOwnership(pin, user_id);

  const deletedPin = await Pin.findByIdAndDelete(pin_id);

  // Invalidate caches
  cache.del(`pin_${pin_id}`);
  cache.del('all_pins');

  return deletedPin;
};

module.exports = { getPins, getPinById, create, update, remove };
