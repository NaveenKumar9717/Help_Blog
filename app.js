const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
var MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

//Loading all config file
dotenv.config({ path: "./config/config.env" });

//Passport configm
require("./config/passport")(passport);

connectDB();

const app = express();
//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method overrideff';l

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Middleware for Nodel
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Handlebrs  setting
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");

// var store = new MongoStore({mongooseConnection: mongoose.connection }) ;
//SESSSION
app.set('trust proxy', 1) 
app.use(
  session({
    secret: "story book",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    })
   
    
  })
);

//passport midleware
app.use(passport.initialize());
app.use(passport.session());

// Making Global Variable

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

app.get("/ping",(req, res) =>{
    res.send("App is Live bro")
})
app.use("/", require("./routes/index.js"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));


//defining staticfolder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
