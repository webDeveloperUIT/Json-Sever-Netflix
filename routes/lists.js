const router = require("express").Router();
const verifyToken = require("../verifyToken");
const listController = require("../controller/listController");
const listRoutes = (app) => {
  // create list movies
  router.post("/create", verifyToken, listController.createListMovie);
  // update list movie
  router.put("/update/:id", verifyToken, listController.updateListMovie);
  // delete list movies
  router.delete("/delete/:id", verifyToken, listController.deleteListMovie);
  // get list movies
  router.get("/", listController.getListMovie);
  return app.use("/api/list/", router);
};
export default listRoutes;
