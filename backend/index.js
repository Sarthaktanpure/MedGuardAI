require("dotenv").config({});
const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;

async function main(res) {
  mongoose.connect(process.env.MONGO_URI);
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  main()
    .then((res) => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log("Failed to connect the DB");
    });
});
