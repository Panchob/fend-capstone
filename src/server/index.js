var path = require('path');

const bodyParser = require('body-parser');
const cors  = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const fetch = require("node-fetch");
const { raw } = require('body-parser');
const app = express();

dotenv.config();

const WEATHERBIT_KEY = process.env.WEATHERBIT_KEY
const MAPBOX_KEY = process.env.MAPBOX_KEY
const PIXABAY_KEY = process.env.PIXABAY_KEY

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

// Landing page
app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});

app.post('/location', async(req, res)=>{
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.cityName}.json?country=ca&access_token=${MAPBOX_KEY}`
    res.send(await fetchData(url))
});

app.post('/weekForecast', async(req, res)=>{
    const lat = req.body.latitude;
    const lon = req.body.longitude;
    const day = req.body.day;

    const url =`https://api.weatherbit.io/v2.0/forecast/daily?lat=76.5668&lon=-78.1018&key=${WEATHERBIT_KEY}`
    res.send(await fetchData(url))
});

app.post('/normalForecast', async(req, res)=> {
    const lat = req.body.latitude;
    const lon = req.body.longitude;
    const date = req.body.date

    const url = `https://api.weatherbit.io/v2.0/normals?lat=38.0&lon=-78.0&start_day=02-02&end_day=03-01&tp=daily&key=${WEATHERBIT_KEY}`

    res.send(await fetchData(url));
});

app.post('/picture', async(req, res)=>{
    const url =`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${req.body.city}&image_type=photo&pretty=true`
    res.send(await fetchData(url))
});

async function fetchData(url){
    const response = await fetch(url);

    try{
        const data = await response.json()
        return data;
    }catch{
        console.log("error", error);
    }
}

// Designates what port the app will listen to for incoming requests
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
});
