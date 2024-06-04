const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const model = require("./salefunctions");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Middleware to make the user object available in all templates
router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// ADMIN PAGES
router.get("/", async (req, res) => {
  let properties = await model.getProperties();
  res.render("sale-admin", {
    title: "Sale Admin menu",
    listings: properties,
  });
});

router.get("/add", async (req, res) => {
  let properties = await model.getProperties();
  res.render("sale-add", {
    title: "Add Sales",
    listings: properties,
  });
});

// ADMIN FORM PROCESSING PATHS
router.post("/add/submit", async (req, res) => {
  //retrieve values from submitted POST form
  let image = req.body.image;
  let price = req.body.price;
  let address = req.body.address;
  let detailsLink = req.body.detailsLink;
  let newProperty = {
    image: image,
    price: price,
    address: address,
    detailsLink: detailsLink,
  };
  await model.addProperty(newProperty);
  res.redirect("/admin/sale");
});

// Delete
router.get("/delete", async (req, res) => {
  //get linkId value
  let id = req.query.propertyId;
  await model.deleteProperty(id);
  res.redirect("/admin/sale");
});

// Edit
router.get("/edit", async (req, res) => {
  if (req.query.propertyId) {
    let PropertyToEdit = await model.getSingleProperty(req.query.propertyId);
    let Properties = await model.getProperties();
    res.render("sale-edit", {
      title: "Edit Sales",
      listing: Properties,
      editProperty: PropertyToEdit,
    });
  } else {
    res.redirect("/admin/sale");
  }
});

router.post("/edit", async (req, res) => {
  let idFilter = { _id: new ObjectId(req.body.propertyId) };
  let Properties = {
    image: req.body.image,
    price: req.body.price,
    address: req.body.address,
    detailsLink: req.body.detailsLink,
  };

  await model.editProperty(idFilter, Properties);
  res.redirect("/admin/sale");
});

module.exports = router;
