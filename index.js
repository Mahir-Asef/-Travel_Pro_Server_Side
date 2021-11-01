const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sd44u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("travelPro");
    const tripsCollection = database.collection("trips");
    const cartCollection = database.collection("cart");

    // GET ALL TRIP 

    app.get("/trips", async (req, res) => {
      const cursor = tripsCollection.find({});
      const trips = await cursor.toArray();
      res.send(trips);
    });

    //post data to a trips

    app.post("/trips", async (req, res) => {
      const trip = req.body;
      const result = await tripsCollection.insertOne(trip);
      res.json(result);
    });

    // get data for a single trip

    app.get("/trips/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const trip = await tripsCollection.findOne(query);
      res.json(trip);
    });

    // add data to cart

    app.post("/cart", async (req, res) => {
      const trip = req.body;
      const result = await cartCollection.insertOne(trip);
      res.json(result);
    });

    //get data from cart

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find({});
      const trips = await cursor.toArray();
      res.send(trips);
    });

    // get cart data for unique id

    app.get("/cart/:uid", async (req, res) => {
      const uid = req.params.uid;
      console.log(uid);
      const query = { uid : uid };
      const result = await cartCollection.find(query).toArray();
      res.json(result);
    });

    // delete a single trip

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.json(result);
    });
  } 
  finally {
    // await client.close()
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Hello from web!");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
