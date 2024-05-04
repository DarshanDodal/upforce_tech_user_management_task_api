// userRoutes.js

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const upload = require("../config/multer"); // Import the Multer middleware

// POST /api/users
router.post(
  "/users",
  upload.single("profilePhoto"), // Use Multer middleware for file upload
  [
    body("email").isEmail().normalizeEmail(),
    body("mobile").isMobilePhone(),
    body("gender").isIn(["Male", "Female"]),
  ],
  userController.createUser
);

// GET /api/users
router.get("/users", userController.getAllUsers);

// PUT /api/users/:userId
router.put(
  "/users/:userId",
  upload.single("profilePhoto"),
  userController.editUser
);

// DELETE /api/users/:userId
router.delete("/users/:userId", userController.deleteUser);

// GET /api/users/search?query=query_string
router.get("/users/search", userController.searchUsers);

// GET /api/users/export/csv
router.get("/users/export/csv", userController.exportToCSV);

module.exports = router;
