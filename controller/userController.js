const User = require("../models/User");
const userService = require("../services/userService");
const CryptoJS = require("crypto-js");

//[PUT] /api/users/create
const NewUser = async (req, res) => {
  try {
    let DTO = await userService.NewUser(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};

//[PUT] /api/users/:id
const updateUser = async (req, res) => {
  try {
    let DTO = await userService.updateUser(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
//[DELETE] /api/users/deleted/:id
const deleteUser = async (req, res) => {
  try {
    let DTO = await userService.deleteUser(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(403).json("You can't delete account!");
  }
};
//[GET] /api/users/find/:id
const getUser = async (req, res) => {
  try {
    let DTO = await userService.getUser(req);
    console.log(DTO.error);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
//[GET] /api/users/
const getAllUser = async (req, res) => {
  try {
    let DTO = await userService.getAllUser(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
// [GET] /api/users/stats/
const getStateUsers = async (req, res) => {
  try {
    let DTO = await userService.getStateUsers(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
//[POST] api/user/get/movie
const postMovie = async (req, res) => {
  try {
    let DTO = await userService.postMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
//[POST] api/user/get/voucher
const postVoucher = async (req, res) => {
  try {
    let DTO = await userService.postVoucher(req);
    console.log(DTO);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};

const vnpayPayment = async (req, res) => {
  try {
    let DTO = await userService.vnpayPayment(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};

const vnpayIpn = async (req, res, next) => {
  try {
    let DTO = await userService.vnpayIpn(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(DTO.message);
  }
};
module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
  getStateUsers,
  postMovie,
  postVoucher,
  vnpayPayment,
  vnpayIpn,
  NewUser,
};
