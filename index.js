const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
// cors origin
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
};

// middleware
app.use(express.json());
app.use(cors(corsOptions));

// mongodb

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.ixszr3u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    //data collection
    // all-product
    const productCollection = client.db("gadget-hub").collection("all-product");

    // get

    // all-product

    app.get("/products", async (req, res) => {
      // query
      const search = req.query.name;
      const sorted_date = req.query.sort_date;
      const sorted_price = req.query.sort_price;
      console.log(search);
      // search
      let query = {};
      if (search) {
        query.name = { $regex: search, $options: "i" }; 
        console.log(search);
      }
      // sort option
      let sortOption = {};

      //  sorting by date
      if (sorted_date == "newest_first") {
        sortOption.createdAt = -1;
      } else if (sorted_date == "older_first") {
        sortOption.createdAt = 1;
      }

      // sorting by price
      if (sorted_price == "low_to_high") {
        sortOption.price = 1;
      } else if (sorted_price == "high_to_low") {
        sortOption.price = -1;
      }

      const allProduct = await productCollection
        .find(query)
        .sort(sortOption)
        .toArray();
      res.send(allProduct);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// test server
app.get("/", (req, res) => {
  res.send("server is working");
});
app.listen(port, () => {
  console.log(`this server is running on port${port}`);
});
