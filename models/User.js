import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    movies: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
