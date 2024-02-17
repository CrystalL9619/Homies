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
async function getRents() {
  db = await connection();
  let results = db.collection("Rent").find({});
  let res = await results.toArray();
  console.log(res);
  return res;
}

//Function to insert one property
async function addRent(rentData) {
  db = await connection();
  let status = await db.collection("Rent").insertOne(rentData);
  console.log("property added");
}
//Function to delete a property
async function deleteRent(id) {
  db = await connection();
  const deleteId = { _id: new ObjectId(id) };
  const result = await db.collection("Rent").deleteOne(deleteId);
  if (result.deletedCount == 1) console.log("delete successful");
}
//Function to update a property
async function getSingleRent(id) {
  const db = await connection();
  const editId = { _id: new ObjectId(id) };
  const result = await db.collection("Rent").findOne(editId);
  return result;
}
//Function to edit a property
async function editRent(filter, updatedRent) {
  const db = await connection();
  const updateDocument = {
    $set: updatedRent,
  };

  const result = await db.collection("Rent").updateOne(filter, updateDocument);

  if (result.modifiedCount === 1) {
    console.log("Property updated successfully");
  } else {
    console.log("Property not found or not modified");
  }
}

module.exports = {
  getRents,
  addRent,
  deleteRent,
  getSingleRent,
  editRent,
};
