const Pin = require('../models/Pin');
const Comment = require('../models/Comment');
const cache = require('../utils/cache');
const fileService = require('./fileService');

const ensureAuthenticated = (user) => {
  if (!user || !user.id) {
    throw new Error('Unauthorized: No user ID found');
  }
  return user.id;
};

const findPinById = async (pin_id) => {
  const pin = await Pin.findById(pin_id);
  if (!pin) {
    throw new Error('Pin not found');
  }
  return pin;
};

const verifyPinOwnership = (pin, user_id) => {
  if (pin.user_id.toString() !== user_id.toString()) {
    throw new Error('Unauthorized: You can only modify your own pins');
  }
};

const getPins = async (sortOrder = 'newest') => {
  const cacheKey = `all_pins_${sortOrder}`;
  const cachedPins = await cache.get(cacheKey);

  if (cachedPins) {
    console.log(`[CACHE] Serving all pins (${sortOrder}) from cache`);
    return cachedPins;
  }

  const sortDirection = sortOrder === 'oldest' ? 1 : -1;

  const pins = await Pin.aggregate([
    { $sort: { createdAt: sortDirection } },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
  ]);

  await cache.set(cacheKey, pins);
  console.log(`[DB] Fetched all pins (${sortOrder}) from database`);
  return pins;
};

const getPinById = async (pin_id) => {
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
          path: 'user_id',
          model: 'User',
          select: 'email',
        },
      });

    if (!pin) throw new Error('Pin not found');

    console.log(`[DB] Fetched pin ${pin_id} from database`);
    return pin;
  } catch (error) {
    throw new Error('Error retrieving pin with comments: ' + error.message);
  }
};

const create = async (req) => {
  const { title, description } = req.body;
  const file = req.file;
  const user_id = ensureAuthenticated(req.user);

  let file_url = '';
  if (file) {
    file_url = await fileService.uploadFile(file);
  }

  return await Pin.create({ title, description, file_url, user_id });
};

const update = async (req) => {
  const { title, description } = req.body;
  const file = req.file;
  const pin_id = req.params.id;
  const user_id = ensureAuthenticated(req.user);

  const pin = await findPinById(pin_id);
  verifyPinOwnership(pin, user_id);

  let file_url = pin.file_url;
  if (file) {
    // Delete old file if exists
    if (pin.file_url) {
      const oldFileName = pin.file_url.split('/').pop();
      await fileService.deleteFile(oldFileName);
    }
    file_url = await fileService.uploadFile(file);
  }

  const updatedPin = await Pin.findByIdAndUpdate(
    pin_id,
    { title, description, file_url },
    { new: true },
  );

  await Promise.all([
    cache.del(`pin_${pin_id}`),
    cache.del('all_pins_newest'),
    cache.del('all_pins_oldest'),
  ]);

  return updatedPin;
};

const remove = async (req) => {
  const pin_id = req.params.id;
  const user_id = ensureAuthenticated(req.user);

  const pin = await findPinById(pin_id);
  verifyPinOwnership(pin, user_id);

  if (pin.file_url) {
    const fileName = pin.file_url.split('/').pop();
    await fileService.deleteFile(fileName);
  }

  const deletedPin = await Pin.findByIdAndDelete(pin_id);

  await Promise.all([
    cache.del(`pin_${pin_id}`),
    cache.del('all_pins_newest'),
    cache.del('all_pins_oldest'),
  ]);

  return deletedPin;
};

module.exports = { getPins, getPinById, create, update, remove };
