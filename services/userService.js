// userService.js

const User = require("../models/User");

// Pagination support for users
exports.getUsersWithPagination = async (page, limit) => {
  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  return users;
};
