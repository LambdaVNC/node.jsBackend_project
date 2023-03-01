const express = require("express");
const dotenv = require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

// template engine settings
const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const path = require("path");

// include express and ejs
app.use(expressLayouts);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./src/views"));

// router include
const authRouter = require("./src/routers/auth_router");
const managementRouter = require("./src/routers/management_router");

// DB CONNECTİON
require("./src/config/database");
const MongoDBStore = require("connect-mongodb-session")(session);

const sessionStorage = new MongoDBStore({
  uri: process.env.MONGODB_CONNECTION_STRING,
  collection: "sessions",
});

// session ve flash message
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000*60*60*24*7
      // THİS SESSİON FOR A ONE WEEK
    },
    store: sessionStorage,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.validation_errors = req.flash("validation_errors");
  res.locals.success_message = req.flash("success_message");
  res.locals.email = req.flash("email");
  res.locals.name = req.flash("name");
  res.locals.surname = req.flash("surname");
  // login errorlarını yakalamak
  res.locals.login_error = req.flash("error");
  next();
});

// formdan gelen değerlerin okunabilmesi için
app.use(express.urlencoded({ extended: true }));


// add Passport
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());


let counter = 0;
app.get("/", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
  } else {
    req.session.counter = 1;
  }
  res.json({ mesaj: "basarili", counter: req.session.counter, user: req.user });
});

app.use("/", authRouter);
app.use("/management", managementRouter);
app.listen(process.env.PORT, (_) => {
  console.log(`The server is up from port ${process.env.PORT}!`);
});
