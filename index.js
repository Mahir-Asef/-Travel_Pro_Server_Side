const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sd44u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {

    await client.connect();
    const database = client.db("travelPro");
    const tripsCollection = database.collection("trips");


    // GET API


    app.get("/trips", async (req, res) => {
      const cursor = tripsCollection.find({});
      const trips = await cursor.toArray();
      res.send(trips);
    });


    // GET SINGLE TOUR INFO


    app.get("/trips/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific trip", id);
      const query = { _id: ObjectId(id) };
      const trip = await tripsCollection.findOne(query);
      res.json(trip);
    });
  } 
  finally {
    // await client.close()
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
