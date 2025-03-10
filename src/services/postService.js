const Post = require('../models/Post');

const getPosts = async () => {
  return await Post.find();
};
const create = async (req) => {
  const { title, description, file_url } = req.body;

  const user = req.user;
  const user_id = user.id;

  if (!user || !user.id) {
    throw new Error('Unauthorized: No user ID found');
  }

  return await Post.create({ title, description, file_url, user_id });
};

const update = async (req) => {
  const { title, description, file_url } = req.body;

  const post_id = req.params.id;
  const user = req.user;
  const user_id = user.id;

  if (!user || !user.id) {
    throw new Error('Unauthorized: No user ID found');
  }

  const post = await Post.findOne({ _id: post_id });
  if (post.user_id.toString() !== user_id.toString()) {
    throw new Error('Unauthorized: user not allowed');
  }

  const updatedPost = await Post.findByIdAndUpdate(
    post_id,
    { title, description, file_url },
    { new: true },
  );

  return updatedPost;
};

module.exports = { create, update, getPosts };
