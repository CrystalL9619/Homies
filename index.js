const express = require("express"); //include express in this app
const path = require("path"); //module to help with file paths
const dotenv = require("dotenv");
dotenv.config();
const { request } = require("http");
//import page routers
const pageRouter = require("./modules/pages/router");
const adminSaleRouter = require("./modules/listings/saleroutes");
const adminRentRouter = require("./modules/listings/rentroutes");

const bodyParser = require("body-parser");
const app = express(); //create an Express app
const port = process.env.PORT || "8888";

//SET UP TEMPLATE ENGINE (PUG)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//SET UP A PATH FOR STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

//SET UP FOR EASIER  FORM DATA PARSING

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//SET UP A ROUTE FOR ADMIN
app.get("/admin", (req, res) => {
  res.render("admin");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

//use page routers from module
app.use("/", pageRouter);
app.use("/admin/sale", adminSaleRouter);
app.use("/admin/rent", adminRentRouter);
