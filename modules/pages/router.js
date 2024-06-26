const express = require("express");
const pageRouter = express.Router();
const listings = require("../listings/salefunctions");
const rentals = require("../listings/rentfunctions");
pageRouter.use(express.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");
const model = require("./user");
pageRouter.use(express.json());
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const initPassport = require("./passport-config");
const methodOverride = require("method-override");
pageRouter.use(methodOverride("_method"));
const mortgageCalculator = require("./mortgage");
const {
  checkNotAuthenticated,
  checkAuthenticated,
  isAdmin,
} = require("./auth");

initPassport(
  passport,
  async (email) => model.checklogin(email),
  async (id) => model.checkloginById(id)
);

pageRouter.use(flash());
pageRouter.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
pageRouter.use(passport.initialize());
pageRouter.use(passport.session());

pageRouter.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

pageRouter.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});
pageRouter.get("/register", checkNotAuthenticated, async (req, res) => {
  res.render("register");
});
pageRouter.post("/register/submit", checkNotAuthenticated, async (req, res) => {
  try {
    console.log("Password received:", req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    console.log(newUser);
    await model.register(newUser);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/register");
  }
});
pageRouter.post(
  "/login/submit",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
pageRouter.get("/sale", async (req, res) => {
  let properties = await listings.getProperties();
  res.render("sale", { properties, user: req.user });
});

pageRouter.get("/rent", async (req, res) => {
  let rents = await rentals.getRents();
  res.render("rent", { rents, user: req.user });
});

pageRouter.get("/mortgage", (req, res) => {
  res.render("mortgage", { user: req.user });
});

pageRouter.post("/mortgage", (req, res) => {
  const { loanAmount, interestRate, loanTerm } = req.body;
  mortgageCalculator(loanAmount, interestRate, loanTerm, res, req);
});

pageRouter.delete("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

pageRouter.get("/admin", isAdmin, (req, res) => {
  res.render("admin", { user: req.user });
});
module.exports = pageRouter;
