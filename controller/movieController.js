const Movie = require("../models/Movie");
const movieService = require("../services/movieService");

//[post] /api/movies/create/
const createMovie = async (req, res) => {
  console.log(req);
  try {
    let DTO = await movieService.createMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
// [PUT] /api/movies/update
const updateMovie = async (req, res) => {
  console.log(req);
  try {
    let DTO = await movieService.updateMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
// [DELETE] /api/movies/delete/:id
const deleteMovie = async (req, res) => {
  try {
    let DTO = await movieService.deleteMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
// [GET] /api/movies/find/:id
const getMovie = async (req, res) => {
  try {
    let DTO = await movieService.getMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
// [GET] /api/movies/random
const getRandomMovie = async (req, res) => {
  try {
    let DTO = await movieService.getRandomMovie(req);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
// [GET] /api/movies/
const getAllMovie = async (req, res) => {
  try {
    let DTO = await movieService.getAllMovie(req);
    console.log(DTO);
    if (DTO.error) {
      res.status(500).json(DTO.message);
    }
    res.status(200).json(DTO);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovie,
  getRandomMovie,
  getAllMovie,
};
