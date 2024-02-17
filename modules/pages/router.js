const express = require("express");
const pageRouter = express.Router();
const listings = require("../listings/salefunctions");
const rentals = require("../listings/rentfunctions");

pageRouter.get("/", (req, res) => {
  res.render("home");
});
pageRouter.get("/sale", async (req, res) => {
  let properties = await listings.getProperties();
  res.render("sale", { properties });
});
pageRouter.get("/rent", async (req, res) => {
  let rents = await rentals.getRents();
  res.render("rent", { rents });
});

module.exports = pageRouter;
