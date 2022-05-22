const router = require("express").Router();
const express = require("express");
const authController = require("../controller/authController");
const authRoutes = (app) => {
  //regiter
  router.post("/register", authController.handleCreateUser);
  // login
  router.post("/login", authController.handleLogin);
  return app.use("/api/auth/", router);
};

export default authRoutes;
