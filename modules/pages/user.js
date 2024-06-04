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

//Function to select all document in  collection
async function register(newUser) {
  try {
    db = await connection();
    newUser.role = newUser.role || "user";
    const result = await db.collection("Account").insertOne(newUser);
    return result;
  } catch (error) {
    console.error("Error registering account:", error);
    throw error;
  }
}
async function checklogin(email) {
  try {
    const db = await connection();
    const user = await db.collection("Account").findOne({ email });
    return user;
  } catch (error) {
    console.error("Error checking login:", error);
    throw error;
  }
}
async function checkloginById(id) {
  try {
    const db = await connection();
    const user = await db
      .collection("Account")
      .findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    console.error("Error checking login by ID:", error);
    throw error;
  }
}

module.exports = {
  connection,
  register,
  checklogin,
  checkloginById,
};
