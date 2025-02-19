const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./models/user");

mongoose
  .connect("mongodb://127.0.0.1/auth_demo")
  .then((result) => {
    console.log("connect to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "notesecret",
    resave: false,
    saveUninitialized: false,
  })
);

const auth = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

const authlr = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect("/admin");
  }
  return next();
};

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/register", authlr, (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    username,
    password: hashPassword,
  });
  await user.save();
  res.redirect("/admin");
});

app.get("/login", authlr, (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    const isMath = await bcrypt.compare(password, user.password);
    if (isMath) {
      req.session.user_id = user._id;
      res.redirect("/admin");
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", auth, (req, res) => {
  // req.session.user_id = null
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/admin", auth, (req, res) => {
  res.render("admin");
});

app.get("/profile/settings", auth, (req, res) => {
  res.send("profile settings" + req.session.user_id);
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
