const router = require("express").Router();
const user = require("../models/User");
const CryptoJS = require("crypto-js");
const userController = require("../controller/userController");
const verifyToken = require("../verifyToken");

const userRoutes = (app) => {
  //update user
  router.put("/:id", verifyToken, userController.updateUser);
  //create user
  router.post("/create", verifyToken, userController.NewUser);

  //delete user
  router.delete("/delete/:id", verifyToken, userController.deleteUser);
  //get
  router.get("/find/:id", userController.getUser);
  //get all
  router.get("/", verifyToken, userController.getAllUser);
  //get user stats
  router.get("/stats", userController.getStateUsers);
  router.post("/get/movie", verifyToken, userController.postMovie);
  router.post("/get/voucher", verifyToken, userController.postVoucher);
  // user payment
  router.post("/vnpay_payment", verifyToken, userController.vnpayPayment);
  router.post("/vnpay_ipn", verifyToken, userController.vnpayIpn);
  // top user
  router.get("/list/top", verifyToken, userController.topUser);

  return app.use("/api/users/", router);
};
export default userRoutes;
