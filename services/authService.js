import User from "../models/User";
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

// create a new hashPassword

const hashPassword = (password) => {
  var newPassword = CryptoJS.AES.encrypt(
    password,
    process.env.SECRET_KEY
  ).toString();
  return newPassword;
};

const createNewUser = async (body) => {
  const username = body.username;
  const email = body.email;
  const password = body.password;

  try {
    const user = await User.findOne({ email: body.email });
    console.log(user);
    if (user) {
      return {
        error: true,
        message: "Email is not valid!",
      };
    }
    const newPassword = hashPassword(password);
    const newUser = new User({
      username,
      email,
      password: newPassword,
    });

    await newUser.save();
    console.log(user);

    return {
      error: false,
      message: "Register SuccessFully!",
      user,
    };
  } catch (err) {
    return {
      error: true,
      message: err.message,
    };
  }
};
const login = async (body) => {
  try {
    const user = await User.findOne({ email: body.email });
    console.log(user);
    if (!user) {
      return {
        error: true,
        message: "Wrong password or email!",
      };
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== body.password) {
      return {
        error: true,
        message: "Wrong password or email!",
      };
    }

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    // get user info subtract password
    const { password, ...info } = user._doc;

    return {
      error: false,
      message: "Login SuccessFully!",
      data: info,
      token: accessToken,
    };
  } catch (err) {
    return {
      error: true,
      message: err.message,
    };
  }
};

module.exports = {
  createNewUser,
  login,
};
