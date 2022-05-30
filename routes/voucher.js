const voucherController = require("../controller/voucherController");
const verifyToken = require("../verifyToken");

const router = require("express").Router();

// const authController = require("../controller/authController");
const voucherRoutes = (app) => {
  router.get("/search", voucherController.getVouchersBySearch);
  router.get("/list", voucherController.getVouchers);
  router.post("/create", verifyToken, voucherController.addVoucher);
  router.get("/get/:id", verifyToken, voucherController.getVoucher);
  router.post("/update/:id", verifyToken, voucherController.updateVoucher);
  router.delete("/delete/:id", verifyToken, voucherController.deleteVoucher);

  return app.use("/api/vouchers/", router);
};

export default voucherRoutes;
