const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { default: authRoutes } = require("./routes/auth");
const { default: userRoutes } = require("./routes/users");
const { default: movieRoutes } = require("./routes/movies");
const { default: listRoutes } = require("./routes/lists");
const { default: voucherRoutes } = require("./routes/voucher");
const app = express();
var cors = require("cors");

const bodyParser = require("body-parser");

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(express.static("public"));
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   // Pass to next layer of middleware
//   next();
// });

app.use(cors());
dotenv.config();
//connect database
const port = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection SuccessFull"))
  .catch((err) => console.log(err));

app.use(express.json());
// authentication routes
authRoutes(app);
// user routes
userRoutes(app);
// movie routes
movieRoutes(app);
// list moives routes
listRoutes(app);
// list moives routes
voucherRoutes(app);

app.listen(port, () => {
  console.log("Backend sever is running");
});
