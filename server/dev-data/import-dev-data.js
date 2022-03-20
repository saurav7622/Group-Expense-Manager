const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Group = require("./../models/groupModel");

dotenv.config({ path: `${__dirname}/../config.env` });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

// Read JSON File
const groups = JSON.parse(fs.readFileSync(`${__dirname}/groups.json`, "utf-8"));

//import data into DB
const importData = async () => {
  try {
    await Group.create(groups);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data from collection
const deleteData = async () => {
  try {
    await Group.deleteMany();
    console.log("Data deleted successfully!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
