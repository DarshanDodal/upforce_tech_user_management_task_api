const {
  createUser,
  getAllUsers,
  editUser,
  deleteUser,
  searchUsers,
  exportToCSV,
} = require("../controllers/userController");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const csv = require("csv-parser");
const fs = require("fs");

// Mocking express-validator validationResult
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

// Mocking fs module
jest.mock("fs");

// Mocking User model
jest.mock("../models/User");

describe("User Controller", () => {
  describe("createUser", () => {
    it("should create a new user", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          mobile: "1234567890",
          gender: "Male",
          status: "active",
          profilePhotoUrl: "http://example.com/profile.jpg",
          location: "New York",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validationResult.mockReturnValueOnce({ isEmpty: () => true });
      User.mockReturnValueOnce({
        save: () => Promise.resolve({ _id: "123", ...req.body }),
      });

      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: "123", ...req.body });
    });

    it("should return validation errors if request body is invalid", async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: "Invalid input" }],
      });

      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Invalid input" }],
      });
    });

    it("should call next middleware if an error occurs", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          mobile: "1234567890",
          gender: "Male",
          status: "active",
          profilePhotoUrl: "http://example.com/profile.jpg",
          location: "New York",
        },
      };
      const res = {};
      const next = jest.fn();
      const error = new Error("Something went wrong");

      validationResult.mockReturnValueOnce({ isEmpty: () => true });
      User.mockReturnValueOnce({ save: () => Promise.reject(error) });

      await createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const users = [
        { _id: "1", firstName: "John", lastName: "Doe" },
        { _id: "2", firstName: "Jane", lastName: "Smith" },
      ];

      User.find.mockReturnValueOnce(users);

      await getAllUsers(req, res, next);

      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("should call next middleware if an error occurs", async () => {
      const req = {};
      const res = {};
      const next = jest.fn();
      const error = new Error("Something went wrong");

      User.find.mockRejectedValueOnce(error);

      await getAllUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("editUser", () => {
    it("should edit user information", async () => {
      const req = {
        params: { userId: "123" },
        body: { firstName: "Updated", lastName: "Name" },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const updatedUser = {
        _id: "123",
        firstName: "Updated",
        lastName: "Name",
      };

      User.findOneAndUpdate.mockReturnValueOnce(updatedUser);

      await editUser(req, res, next);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: req.params.userId },
        { firstName: req.body.firstName, lastName: req.body.lastName },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return 404 if user not found", async () => {
      const req = {
        params: { userId: "123" },
        body: { firstName: "Updated", lastName: "Name" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      User.findOneAndUpdate.mockReturnValueOnce(null);

      await editUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should call next middleware if an error occurs", async () => {
      const req = {
        params: { userId: "123" },
        body: { firstName: "Updated", lastName: "Name" },
      };
      const res = {};
      const next = jest.fn();
      const error = new Error("Something went wrong");

      User.findOneAndUpdate.mockRejectedValueOnce(error);

      await editUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteUser", () => {
    it("should delete user", async () => {
      const req = { params: { userId: "123" } };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const deletedUser = { _id: "123", firstName: "John", lastName: "Doe" };

      User.findOneAndDelete.mockReturnValueOnce(deletedUser);

      await deleteUser(req, res, next);

      expect(User.findOneAndDelete).toHaveBeenCalledWith({
        userId: req.params.userId,
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      const req = { params: { userId: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      User.findOneAndDelete.mockReturnValueOnce(null);

      await deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should call next middleware if an error occurs", async () => {
      const req = { params: { userId: "123" } };
      const res = {};
      const next = jest.fn();
      const error = new Error("Something went wrong");

      User.findOneAndDelete.mockRejectedValueOnce(error);

      await deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("searchUsers", () => {
    it("should return users matching search query", async () => {
      const req = { query: { query: "searchQuery" } };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const users = [
        { _id: "1", firstName: "John", lastName: "Doe" },
        { _id: "2", firstName: "Jane", lastName: "Smith" },
      ];

      User.find.mockReturnValueOnce(users);

      await searchUsers(req, res, next);

      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("should call next middleware if an error occurs", async () => {
      const req = { query: { query: "searchQuery" } };
      const res = {};
      const next = jest.fn();
      const error = new Error("Something went wrong");

      User.find.mockRejectedValueOnce(error);

      await searchUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("exportToCSV", () => {
    it("should export users to CSV file", async () => {
      // Mock req, res, next
      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();

      // Mock User.find function
      User.find = jest
        .fn()
        .mockResolvedValueOnce([
          { firstName: "John", lastName: "Doe", email: "john@example.com" },
        ]);

      // Mock fs.createReadStream
      fs.createReadStream = jest.fn().mockReturnValueOnce({ pipe: jest.fn() }); // Mocking a readable stream

      // Mock csvStream
      const csvStream = { write: jest.fn(), end: jest.fn(), pipe: jest.fn() }; // Mocking csvStream methods
      csv.stringify = jest.fn().mockReturnValueOnce(csvStream); // Mock csv.stringify function

      // Call the function
      await exportToCSV(req, res, next);

      // Assertions
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        "attachment; filename=users.csv"
      );
      expect(csv.stringify).toHaveBeenCalledWith({ header: true });
      expect(csvStream.pipe).toHaveBeenCalled(); // Ensure pipe() is called
      expect(next).not.toHaveBeenCalled();
    });
    it("should call next middleware if an error occurs", async () => {
      // Mock req, res, next
      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();

      // Mock User.find function to throw an error
      User.find = jest.fn().mockRejectedValueOnce(new Error("Test error"));

      // Call the function
      await exportToCSV(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalledWith(new Error("Test error"));
    });
  });
});
