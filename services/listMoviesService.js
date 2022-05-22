const List = require("../models/List");
const createListMovie = async (req) => {
  if (req.user.isAdmin) {
    try {
      const listMovies = new List(req.body);
      await listMovies.save();
      return {
        error: false,
        message: "Create list movies successfully!",
        data: listMovies,
      };
    } catch (err) {
      return {
        error: true,
        message: err.message,
      };
    }
  } else {
    return {
      error: true,
      message: "Create list movies failure!",
    };
  }
};
const deleteListMovie = async (req) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      return {
        error: false,
        message: "The list movies has been deleted...",
      };
    } catch (err) {
      return {
        error: true,
        message: err.message,
      };
    }
  } else {
    return {
      error: true,
      message: "Delete list movies failure!",
    };
  }
};
const getListMovie = async (req) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    return {
      error: false,
      message: "Get list movies successfully!",
      data: list,
    };
  } catch (err) {
    return {
      error: true,
      message: err.message,
    };
  }
};
module.exports = {
  createListMovie,
  deleteListMovie,
  getListMovie,
};
