const listMoviesService = require("../services/listMoviesService");
// [GET] /api/list/create
const createListMovie = async (req, res) => {
  console.log(req);
  try {
    let DTO = await listMoviesService.createListMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
const deleteListMovie = async (req, res) => {
  try {
    let DTO = await listMoviesService.deleteListMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getListMovie = async (req, res) => {
  try {
    let DTO = await listMoviesService.getListMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = {
  createListMovie,
  deleteListMovie,
  getListMovie,
};
