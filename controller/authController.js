const User = require("../models/User");
const authService = require("../services/authService");
const dotenv = require("dotenv");
var CryptoJS = require("crypto-js");
import jwt from "jsonwebtoken";
const ErrorResponse = require("../utils/errorResponse");
const handleCreateUser = async (req, res) => {
      try {
            let DTO = await authService.createNewUser(req.body);
            if (DTO.error) {
                  // return next(new ErrorResponse(DTO.message, 500));
                  res.status(500).json(DTO.message);
            }
            res.status(200).json(DTO);
      } catch (err) {}
};

const handleLogin = async (req, res) => {
      try {
            let DTO = await authService.login(req.body);
            if (DTO.error) {
                  res.status(500).json(DTO.message);
            }
            res.status(200).json(DTO);
      } catch (err) {}
};

module.exports = {
      handleCreateUser,
      handleLogin,
};
