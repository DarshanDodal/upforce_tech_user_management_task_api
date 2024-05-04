const { body } = require("express-validator");

exports.validateUserData = [
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("mobile").isMobilePhone(),
  body("gender").isIn(["Male", "Female"]),
];
