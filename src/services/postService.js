const Post = require('../models/Post');

const ensureAuthenticated = (user) => {
  if (!user || !user.id) {
    throw new Error('Unauthorized: No user ID found');
  }
  return user.id;
};

const findPostById = async (post_id) => {
  const post = await Post.findOne({ _id: post_id });
  if (!post) {
    throw new Error('Post not found');
  }
  return post;
};

const verifyPostOwnership = (post, user_id) => {
  if (post.user_id.toString() !== user_id.toString()) {
    throw new Error('Unauthorized: User not allowed');
  }
};

const getPosts = async () => await Post.find();

const create = async (req) => {
  const { title, description, file_url } = req.body;
  const user_id = ensureAuthenticated(req.user);
  return await Post.create({ title, description, file_url, user_id });
};

const update = async (req) => {
  const { title, description, file_url } = req.body;
  const post_id = req.params.id;
  const user_id = ensureAuthenticated(req.user);

  const post = await findPostById(post_id);
  verifyPostOwnership(post, user_id);

  return await Post.findByIdAndUpdate(
    post_id,
    { title, description, file_url },
    { new: true },
  );
};

const remove = async (req) => {
  const post_id = req.params.id;
  const user_id = ensureAuthenticated(req.user);

  const post = await findPostById(post_id);
  verifyPostOwnership(post, user_id);

  return await Post.findByIdAndDelete(post_id);
};

module.exports = { getPosts, create, update, remove };
