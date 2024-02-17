const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const model = require("./salefunctions");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//ADMIN PAGES
router.get("/", async (request, response) => {
  let properties = await model.getProperties();
  response.render("sale-admin", {
    title: "Sale Admin menu ",
    listings: properties,
  });
});
router.get("/add", async (request, response) => {
  let properties = await model.getProperties();
  response.render("sale-add", {
    title: "Add Sales",
    listings: properties,
  });
});
//ADMIN FORM PROCESSING PATHS
router.post("/add/submit", async (request, response) => {
  //retrive values from submitted POST form
  let image = request.body.image;
  //console.log(wgt);
  let price = request.body.price;
  let address = request.body.address;
  let detailsLink = request.body.detailsLink;
  let newProperty = {
    image: image,
    price: price,
    address: address,
    detailsLink: detailsLink,
  };
  await model.addProperty(newProperty);
  response.redirect("/admin/sale");
});

//Delete
router.get("/delete", async (request, response) => {
  //get linkId value
  let id = request.query.propertyId;
  await model.deleteProperty(id);
  response.redirect("/admin/sale");
});

//Edit
router.get("/edit", async (request, response) => {
  if (request.query.propertyId) {
    let PropertyToEdit = await model.getSingleProperty(
      request.query.propertyId
    );
    let Properties = await model.getProperties();
    response.render("sale-edit", {
      title: "Edit Sales",
      listing: Properties,
      editProperty: PropertyToEdit,
    });
  } else {
    response.redirect("/admin/sale");
  }
});
router.post("/edit", async (request, response) => {
  console.log(ObjectId);
  let idFilter = { _id: new ObjectId(request.body.propertyId) };
  let Properties = {
    image: request.body.image,
    price: request.body.price,
    address: request.body.address,
    detailsLink: request.body.detailsLink,
  };

  await model.editProperty(idFilter, Properties);

  response.redirect("/admin/sale");
});

module.exports = router;
