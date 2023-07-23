
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://weatherwardrobe:cs120-2023!@weatherwardrobedb.g4hwav7.mongodb.net/?retryWrites=true'";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //this is the docs to be inserted
    const docs = [{
        "item": "Blouse",
        "outfit": "Tops",
        "occasions": ["Casual"],
        "weather": ["Sunny"],
        "tempRange": {"high": 90, "low": 70},
        "image": "URL",
        "gender": ["Female"]
      }
     //Add more docs here to bulk load - must be in same format as above blouse example.URL needs to be updated too.
    ]
    
    //get specific database and collections
    const database = client.db('weatherwardrobe_db');
    const collection = database.collection('outfits');

    //insert docs
    const result = await collection.insertMany(docs);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);


    // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
    finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
