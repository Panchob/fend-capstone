var path = require('path');

const bodyParser = require('body-parser');
const cors  = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const app = express();

const WEATHERBIT_KEY = process.env.WEATHER_BIT_KEY
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME

dotenv.config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

// Landing page
app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});

app.post('/location', localize(req, res));


function localize(req, res){
    let url = `http://api.geonames.org/searchJSON?q=${req.body.cityName}&maxRows=1&username=${GEONAMES_USERNAME}`
    res.send(fetch(url))
}

// Designates what port the app will listen to for incoming requests
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
});
