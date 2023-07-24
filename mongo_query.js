
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://weatherwardrobe:cs120-2023!@weatherwardrobedb.g4hwav7.mongodb.net/?retryWrites=true";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function queryClothingType(collection, type, occasion, weather, temp, gender) {
    /* This functions queries the passed collection for a piece of clothing of
     * a given type that works for the given occasion, weather, and gender. An
     * array (possibly empty) of all matching items is returned.
     */
    const query = {
        'outfit': type,
        'occasions': occasion,
        'weather': weather,
        'tempRange.low': { $lt: temp },
        'tempRange.high': { $gt: temp },
        'gender': gender
    };
    return collection.find(query).toArray();
}

function randomChoice(array) {
    /* This function takes an array and returns a random element from within it.
     * If the array is empty, a null value is returned.
     */
    return array[Math.floor(Math.random() * array.length)];
}

async function queryOutfit(collection, occasion, weather, temp, gender) {
    /* This function queries the passed collection and forms an outfit that
     * works for the given occasion, weather, and gender. If more than one
     * choice for a specific clothing type is returned, a random selection is
     * made. If no matching items exist for a specific clothing type, an empty
     * entry is returned.
     */
    let tops_layer = [];
    if (temp < 60 || weather == 'drizzly' || weather == 'rainy') {
        tops_layer = await queryClothingType(
            collection, 'tops layer', occasion, weather, temp, gender
        );
    }
    const headwear = await queryClothingType(
        collection, 'headwear', occasion, weather, temp, gender
    );
    const tops_base = await queryClothingType(
        collection, 'tops base', occasion, weather, temp, gender
    );
    const bottoms = await queryClothingType(
        collection, 'bottoms', occasion, weather, temp, gender
    );
    const footwear = await queryClothingType(
        collection, 'footwear', occasion, weather, temp, gender
    );

    return {
        'headwear': randomChoice(headwear),
        'tops base': randomChoice(tops_base),
        'tops layer': randomChoice(tops_layer),
        'bottoms': randomChoice(bottoms),
        'footwear': randomChoice(footwear)
    };
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Get specific database and collections
    const database = client.db('weatherwardrobe_db');
    const collection = database.collection('outfits');

    // Query an outfit and log it to the console
    console.log(await queryOutfit(collection, 'casual', 'sunny', 75, 'female'));

    // On the client-side:
    //   For each clothing type:
    //     If clothing type exists:
    //       Display name and image

  } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
  }
}

run().catch(console.dir);
