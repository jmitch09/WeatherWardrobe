<?php

/* This is a quick test for using the MongoDB PHP driver. This script adds a
 * new clothing item to the database, and retrieves the name of some of the
 * clothing items as well.
 *
 * This script expects the environment variable `mongo_uri` to contain a valid
 * connection string for a MongoDB database.
 */

Use MongoDB\Driver\ServerApi as ServerApi;
Use MongoDB\Driver\Manager as Manager;
Use MongoDB\Driver\Query as Query;
Use MongoDB\Driver\BulkWrite as BulkWrite;

$uri = getenv('mongo_uri');
$apiVersion = new ServerApi(ServerApi::V1);
$manager = new Manager($uri, [], ['serverApi' => $apiVersion]);

function addClothingItem($manager, $name, $type, $weather, $temperature, $formality) {
    $bulk = new BulkWrite(['ordered' => true]);
    $bulk->insert([
        'name' => $name,
        'type' => $type,
        'weather' => $weather,
        'temperatue' => $temperature,
        'formality' => $formality,
    ]);
    // There is a lot more error checking that could go on here...
    $result = $manager->executeBulkWrite('weather_wardrobe.clothes', $bulk);
}

// Insert an item
$name = 'blue t-shirt';
$type = 'torso_base';
$weather = ['sunny', 'cloudy'];
$temperature = ['cool', 'mild', 'warm', 'hot'];
$formality = ['athletic', 'casual'];
addClothingItem($manager, $name, $type, $weather, $temperature, $formality);

// Retrieve all items for sunny weather
$filter = ['weather' => 'sunny'];
$options = [];
$query = new Query($filter, $options);
$documents = $manager->executeQuery('weather_wardrobe.clothes', $query);
foreach($documents as $d) {
    $d = json_decode(json_encode($d), true);
    echo $d['name'];
    echo '\n';
}

?>
