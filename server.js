mongo_query = require('./mongo_query');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main_3.html');
});

app.post('/submit', (req, res) => {
    gender = req.body.gender;
    zip_code = req.body.location;
    formality = req.body.formality;
    weather = req.body.weather;
    temp = parseInt(req.body.temp);

    mongo_query.getOutfit(formality, weather, temp, gender, function(outfit) {
        res.json(outfit);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
