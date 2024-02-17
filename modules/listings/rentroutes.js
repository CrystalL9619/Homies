const express = require("express");
const rentRouter = express.Router();
const { ObjectId } = require("mongodb");

const model = require("./rentfunctions");

rentRouter.use(express.urlencoded({ extended: true }));
rentRouter.use(express.json());

//ADMIN PAGES
rentRouter.get("/", async (request, response) => {
  let rents = await model.getRents();
  console.log(rents);
  response.render("rent-admin", {
    title: "Administer menu ",
    rentals: rents,
  });
});
rentRouter.get("/add", async (request, response) => {
  let rents = await model.getRents();
  response.render("rent-add", {
    title: "Add Rental Prpperties",
    rentals: rents,
  });
});
//ADMIN FORM PROCESSING PATHS
rentRouter.post("/add/submit", async (request, response) => {
  //retrive values from submitted POST form
  let image = request.body.image;
  //console.log(wgt);
  let price = request.body.price;
  let address = request.body.address;
  let detailsLink = request.body.detailsLink;
  let newRent = {
    image: image,
    price: price,
    address: address,
    detailsLink: detailsLink,
  };
  await model.addRent(newRent);
  response.redirect("/admin/rent");
});

//Delete
rentRouter.get("/delete", async (request, response) => {
  //get linkId value
  let id = request.query.rentId;
  await model.deleteRent(id);
  response.redirect("/admin/rent");
});

//Edit
rentRouter.get("/edit", async (request, response) => {
  if (request.query.rentId) {
    let RentToEdit = await model.getSingleRent(request.query.rentId);
    let Rents = await model.getRents();
    response.render("rent-edit", {
      title: "Edit Rental Prpperties",
      rental: Rents,
      editRent: RentToEdit,
    });
  } else {
    response.redirect("/admin/rent");
  }
});
rentRouter.post("/edit", async (request, response) => {
  console.log(ObjectId);
  let idFilter = { _id: new ObjectId(request.body.rentId) };
  let Rents = {
    image: request.body.image,
    price: request.body.price,
    address: request.body.address,
    detailsLink: request.body.detailsLink,
  };

  await model.editRent(idFilter, Rents);

  response.redirect("/admin/rent");
});

module.exports = rentRouter;
