const express = require("express");
const rentRouter = express.Router();
const { ObjectId } = require("mongodb");

const model = require("./rentfunctions");

rentRouter.use(express.urlencoded({ extended: true }));
rentRouter.use(express.json());

// Middleware to make the user object available in all templates
rentRouter.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// ADMIN PAGES
rentRouter.get("/", async (req, res) => {
  let rents = await model.getRents();
  console.log(rents);
  res.render("rent-admin", {
    title: "Administer menu",
    rentals: rents,
  });
});

rentRouter.get("/add", async (req, res) => {
  let rents = await model.getRents();
  res.render("rent-add", {
    title: "Add Rental Properties",
    rentals: rents,
  });
});

// ADMIN FORM PROCESSING PATHS
rentRouter.post("/add/submit", async (req, res) => {
  //retrieve values from submitted POST form
  let image = req.body.image;
  let price = req.body.price;
  let address = req.body.address;
  let detailsLink = req.body.detailsLink;
  let newRent = {
    image: image,
    price: price,
    address: address,
    detailsLink: detailsLink,
  };
  await model.addRent(newRent);
  res.redirect("/admin/rent");
});

// Delete
rentRouter.get("/delete", async (req, res) => {
  //get linkId value
  let id = req.query.rentId;
  await model.deleteRent(id);
  res.redirect("/admin/rent");
});

// Edit
rentRouter.get("/edit", async (req, res) => {
  if (req.query.rentId) {
    let RentToEdit = await model.getSingleRent(req.query.rentId);
    let Rents = await model.getRents();
    res.render("rent-edit", {
      title: "Edit Rental Properties",
      rental: Rents,
      editRent: RentToEdit,
    });
  } else {
    res.redirect("/admin/rent");
  }
});

rentRouter.post("/edit", async (req, res) => {
  console.log(ObjectId);
  let idFilter = { _id: new ObjectId(req.body.rentId) };
  let Rents = {
    image: req.body.image,
    price: req.body.price,
    address: req.body.address,
    detailsLink: req.body.detailsLink,
  };

  await model.editRent(idFilter, Rents);
  res.redirect("/admin/rent");
});

module.exports = rentRouter;
