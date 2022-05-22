const router = require("express").Router();
const user = require("../models/User");
const CryptoJS = require("crypto-js");
const userController = require("../controller/userController");
const verifyToken = require("../verifyToken");

const userRoutes = (app) => {
  //update user
  router.put("/:id", verifyToken, userController.updateUser);
  //delete user
  router.delete("/delete/:id", verifyToken, userController.deleteUser);
  //get
  router.get("/find/:id", userController.getUser);
  //get all
  router.get("/", verifyToken, userController.getAllUser);
  //get user stats
  router.get("/stats", userController.getStateUsers);
  return app.use("/api/users/", router);
};
export default userRoutes;
