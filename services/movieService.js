const Movie = require("../models/Movie");
const mongoose = require("mongoose");
// create a new movie
const createMovie = async (req) => {
  console.log(req.body.movie);
  if (req.user.isAdmin) {
    const newMovie = new Movie({
      title: req.body.movie.title,
      desc: req.body.movie.desc,
      img: req.body.movie.img,
      imgSm: req.body.movie.imgSm,
      trailer: req.body.movie.trailer,
      video: req.body.movie.video,
      year: req.body.movie.year,
      limit: req.body.movie.limit,
      genre: req.body.movie.genre,
      price: req.body.movie.price,
      isSeries: req.body.movie.isSeries,
    });

    try {
      const savedMovie = await newMovie.save();
      return {
        error: false,
        message: "Create movie successfully!",
        data: savedMovie,
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
      message: "Create movie failure!",
    };
  }
};
// update movie
const updateMovie = async (req) => {
  if (req.user.isAdmin) {
    try {
      const updateMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return {
        error: false,
        message: "The movie has been update successfully!",
        data: updateMovie,
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
      message: "Update movie failure!",
    };
  }
};
// delete moive
const deleteMovie = async (req) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      return {
        error: false,
        message: "The movie has been deleted....",
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
      message: "Delete movie failure!",
    };
  }
};
// get moive
const getMovie = async (req) => {
  console.log(req.body);
  try {
    const movie = await Movie.findById(req.body.movie_id);
    if (!movie) {
      return {
        error: true,
        message: "Not found movie!",
      };
    }
    return {
      error: false,
      message: "Get moive successfully!",
      data: movie,
    };
  } catch (err) {
    return {
      error: true,
      message: err.message,
    };
  }
};
// get random movie
const getRandomMovie = async (req) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    return {
      error: false,
      message: "Successfully!",
      data: movie,
    };
  } catch (err) {
    return {
      error: false,
      message: "Get random moive failure!",
    };
  }
};
const getAllMovie = async (req) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      return {
        error: false,
        message: "Get all movies successfully!",
        data: movies,
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
      message: "Get all movies failure!",
    };
  }
};
// const getStateMovie = async () => {
//   const today = new Date();
//   const lastYear = today.setFullYear(today.setFullYear() - 1);

//   try {
//     const data = await Movie.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId("629cadd2ef479f17a91e4e40"),
//         },
//       },
//       {
//         $project: {
//           month: { $month: "$updatedAt" },
//           // price: 1,
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     return {
//       error: false,
//       message: "Get stats user successfully!",
//       data,
//     };
//   } catch (err) {
//     return {
//       error: true,
//       message: err.message,
//     };
//   }
// };

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovie,
  getRandomMovie,
  getAllMovie,
  // getStateMovie,
};
