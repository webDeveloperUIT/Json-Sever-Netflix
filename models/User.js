import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://pm1.narvii.com/6915/b750d3766167c6d41dfd8f55e45f72631d100409r1-320-320v2_hq.jpg",
    },
    wallet_balance: {
      type: Number,
      required: true,
      default: 1, // dolar
    },
    point: {
      type: Number,
      required: true,
      default: 0,
    },
    phone: {
      type: String,
      default: "03...",
    },

    vouchers_list: {
      type: Array,
      required: true,
    },
    movies_list: {
      type: Array,
      default: [],
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
