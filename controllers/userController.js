const User = require("../models/User");
const { stringify } = require("csv-stringify/sync");
const { validationResult } = require("express-validator");
const fs = require("fs");

// Add a new user
exports.createUser = async (req, res, next) => {
  try {
    // Extract user details from request body
    const { firstName, lastName, email, mobile, gender, status, location } =
      req.body;

    // Check if an image file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Profile photo is required" });
    }

    // Get the path of the uploaded image
    const imagePath = req.file.path;

    // Create a new user with the provided details
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      gender,
      status,
      location,
      profilePhotoUrl: null, // Initialize profile photo URL
    });

    // Save the user to the database
    const user = await newUser.save();

    // Update the user's profile photo URL with the path of the uploaded image
    user.profilePhotoUrl = imagePath;

    // Save the updated user document
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
// Edit user information
exports.editUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, mobile, gender, status, location } =
      req.body;

    // Check if an image file was uploaded
    if (req.file) {
      // Get the path of the uploaded image
      const imagePath = req.file.path;

      // Find the user by userId
      let user = await User.findOne({ userId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove existing profile photo if it exists
      if (user.profilePhotoUrl) {
        // Delete the existing profile photo
        fs.unlinkSync(user.profilePhotoUrl);
      }

      // Save the profile photo URL with the path of the uploaded image
      user.profilePhotoUrl = imagePath;

      // Save the updated user document
      await user.save();
    }

    // Update user information
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        firstName,
        lastName,
        email,
        mobile,
        gender,
        status,
        location,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findOneAndDelete({ userId: userId }); // Find user by userId and delete

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Search users
exports.searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    const regexQuery = new RegExp(query, "i");

    // Search for users with fields matching the regex query
    const users = await User.find({
      $or: [
        { firstName: { $regex: regexQuery } },
        { lastName: { $regex: regexQuery } },
        { email: { $regex: regexQuery } },
        { mobile: { $regex: regexQuery } },
      ],
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Export users to CSV
exports.exportToCSV = async (req, res, next) => {
  try {
    const users = await User.find();
    const csvData = [];

    users.forEach((user) => {
      const {
        userId,
        firstName,
        lastName,
        email,
        mobile,
        gender,
        status,
        profilePhotoUrl,
        location,
      } = user;
      csvData.push({
        userId,
        firstName,
        lastName,
        email,
        mobile,
        gender,
        status,
        profilePhotoUrl,
        location,
      });
    });

    const csvStringifier = stringify(csvData, { header: true });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");

    res.send(csvStringifier);
  } catch (error) {
    next(error);
  }
};
