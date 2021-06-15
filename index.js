if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user/auth");
const session = require("client-sessions");
const userRouter = require("./routes/user/auth");
const adminRouter = require("./routes/admin/register");
const productRouter = require("./routes/product");
const dbUrl = process.env.dbUrl || "mongodb://localhost:27017/testDB";
const secret = process.env.Secret || "random string";
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});
app.use(
  session({
    cookieName: "session",
    secret,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //Strategies range from verifying a username and password
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); //This file will run every time So there is no need to connect with mongodb further
db.once("open", function () {
  console.log("we are connected!");
});
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", adminRouter);
app.get("/", (req, res) => {
  console.log(req.isAuthenticated());
  console.log(req.user);
  res.send(req.user);
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh boy Something went wrong";
  }
  res.status(statusCode).send(err.message);
});
app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on Port 5000");
});
