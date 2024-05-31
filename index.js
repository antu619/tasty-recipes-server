const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
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
  }
});

async function run() {
  try {
   
    await client.connect();

    const recipes = client.db("recipes");
    const seaFoodCollection = recipes.collection("seaFoodCollection");

    // Sea Food Recipes

    // add sea food
    app.post('/seaFoods', async(req, res) => {
        const recipes = req.body;
        const result = await seaFoodCollection.insertOne(recipes);
        res.send(result)
    });

    // get sea foods
    app.get('/seaFoods', async(req, res) => {
        const recipes = seaFoodCollection.find();
        const result = await recipes.toArray();
        res.send(result)
    })


    // get a single sea food
    app.get('/seaFoods/:id', async(req, res) => {
        const id = req.params.id
        const recipe = await seaFoodCollection.findOne({_id: new ObjectId(id)});
        res.send(recipe)
    })


    // update a single sea food
    app.patch('/seaFoods/:id', async(req, res) => {
        const id = req.params.id;
        const updateDoc = req.body
        const recipe = await seaFoodCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: updateDoc}
        );
        res.send(recipe)
    })
    
    console.log("Connected Tasty Recipes DB");
  } finally {

  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Tasty Recipes Server!')
})

app.listen(port, () => {
  console.log(`Tasty Recipes Server running on port ${port}`)
})


