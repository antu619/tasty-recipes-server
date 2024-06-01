const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ngufuqj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const recipes = client.db("recipes");
    const users = client.db("users");
    const seaFoodCollection = recipes.collection("seaFoodCollection");
    const categoriesCollection = recipes.collection("categoriesCollection");
    const userCollection = users.collection("userCollection");

    // Handle Sea Food Recipes
    // get sea foods
    app.get("/seaFoods", async (req, res) => {
      const recipes = seaFoodCollection.find();
      const result = await recipes.toArray();
      res.send(result);
    });

    // get sea food categories
    app.get("/categories", async (req, res) => {
      const categories = categoriesCollection.find();
      const result = await categories.toArray();
      res.send(result);
    });

    // add sea food
    app.post("/seaFoods", async (req, res) => {
      const recipes = req.body;
      const result = await seaFoodCollection.insertOne(recipes);
      res.send(result);
    });

    // get a single sea food
    app.get("/seaFoods/:id", async (req, res) => {
      const id = req.params.id;
      const recipe = await seaFoodCollection.findOne({ _id: new ObjectId(id) });
      res.send(recipe);
    });

    // update a single sea food
    app.patch("/seaFoods/:id", async (req, res) => {
      const id = req.params.id;
      const updateDoc = req.body;
      const recipe = await seaFoodCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateDoc }
      );
      res.send(recipe);
    });

    // delete a single sea food
    app.delete("/seaFoods/:id", async (req, res) => {
      const id = req.params.id;
      const recipe = await seaFoodCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(recipe);
    });

    // Handle Users Data
    // Add User
    app.post("/user", async (req, res) => {
      const user = req.body;
      const isExists = await userCollection.findOne({ email: user.email });
      if (isExists?.email) {
        return res.send("Logged In");
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // get single user in edit profile
    app.get("/user/profile/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // get single user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    // Update user info
    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const updateDoc = req.body;
      const result = await userCollection.updateOne({ email },{
        $set: updateDoc
      }, {upsert: true});
      res.send(result);
    });
    

    console.log("Connected Tasty Recipes DB");
  } finally {
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Tasty Recipes Server!");
});

app.listen(port, () => {
  console.log(`Tasty Recipes Server running on port ${port}`);
});
