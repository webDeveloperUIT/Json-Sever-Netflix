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
