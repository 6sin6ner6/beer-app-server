require("dotenv").config();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const app = express();
const apiPort = 5050;
const upload = multer({ storage: multer.memoryStorage() });
let db;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@beerapp-etjjl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("BeerApp");
  }
);

app.get("/api/beers", (req, res) => {
  db.collection("Beer List")
    .find()
    .toArray(function (err, results) {
      res.json(results);
    });
});
app.get("/api/access", (req, res) => {
  db.collection("Access")
    .find()
    .toArray(function (err, results) {
      res.json(results);
    });
});

app.post("/api/beers", upload.any(), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const data = new Object(req.body);
  data.image = req.files[0];
  res.send();
  db.collection("Beer List").insertOne(data);
});

app.listen(process.env.PORT || 5050, () =>
  console.log(`Server running on port ${apiPort}`)
);
