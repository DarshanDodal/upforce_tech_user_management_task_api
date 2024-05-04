const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the user
const userSchema = new Schema(
  {
    userId: {
      type: Number,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["M", "F"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    profilePhotoUrl: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Indexes
// userSchema.index({ email: 1, mobile: 1 }); // Ensure uniqueness and optimize queries
// Text index for search fields
userSchema.index({
  email: 1,
  mobile: 1,
  firstName: "text",
  lastName: "text",
  email: "text",
  mobile: "text",
});

// Pre-save hook to generate auto-incrementing userId
userSchema.pre("save", async function (next) {
  console.log("Pre-save hook triggered");
  if (this.isNew) {
    console.log("Generating userId...");
    const lastUser = await this.constructor.findOne(
      {},
      {},
      { sort: { userId: -1 } }
    );
    this.userId = lastUser ? lastUser.userId + 1 : 1;
  }
  next();
});
// Create a model for the schema
const User = mongoose.model("User", userSchema);
module.exports = User;
