const router = require("express").Router();
const Movie = require("../models/Movie");
const verifyToken = require("../verifyToken");
const movieController = require("../controller/movieController");
const movieRoutes = (app) => {
  // create
  router.post("/create", verifyToken, movieController.createMovie);
  // get
  router.get("/get/:id", movieController.getMovie);
  // get all
  router.get("/", verifyToken, movieController.getAllMovie);
  // get random
  router.get("/random", movieController.getRandomMovie);
  // update
  router.put("/update/:id", verifyToken, movieController.updateMovie);
  // delete
  router.delete("/delete/:id", verifyToken, movieController.deleteMovie);
  return app.use("/api/movies/", router);
};
export default movieRoutes;
