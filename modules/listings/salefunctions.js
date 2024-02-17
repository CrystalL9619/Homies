const { MongoClient, ObjectId } = require("mongodb"); //import MongoClient from mongodb
const dbUrl = `mongodb+srv://${encodeURIComponent(
  process.env.DB_USER
)}:${encodeURIComponent(process.env.DB_PWD)}@${process.env.DB_HOST}`;
const client = new MongoClient(dbUrl);

//MONGODB FUNCTIONS
async function connection() {
  db = client.db("Homies"); //inside (),if line 6 already specify the database ,then leave it blank here. if not , write "testdb" here
  return db;
}

//Function to select all document in Home collection
async function getProperties() {
  db = await connection();
  let results = db.collection("Home").find({});
  let res = await results.toArray();
  console.log(res);
  return res;
}

//Function to insert one property
async function addProperty(propertyData) {
  db = await connection();
  let status = await db.collection("Home").insertOne(propertyData);
  console.log("property added");
}
//Function to delete a property
async function deleteProperty(id) {
  db = await connection();
  const deleteId = { _id: new ObjectId(id) };
  const result = await db.collection("Home").deleteOne(deleteId);
  if (result.deletedCount == 1) console.log("delete successful");
}
//Function to update a property
async function getSingleProperty(id) {
  const db = await connection();
  const editId = { _id: new ObjectId(id) };
  const result = await db.collection("Home").findOne(editId);
  return result;
}
//Function to edit a property
async function editProperty(filter, updatedProperty) {
  const db = await connection();
  const updateDocument = {
    $set: updatedProperty,
  };

  const result = await db.collection("Home").updateOne(filter, updateDocument);

  if (result.modifiedCount === 1) {
    console.log("Property updated successfully");
  } else {
    console.log("Property not found or not modified");
  }
}

module.exports = {
  getProperties,
  addProperty,
  deleteProperty,
  getSingleProperty,
  editProperty,
};
