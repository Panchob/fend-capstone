var path = require('path');

const bodyParser = require('body-parser');
const cors  = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const fetch = require("node-fetch");
const { raw } = require('body-parser');
const { handleError, ErrorHandler } = require('./error');
const { response } = require('express');
const app = express();

dotenv.config();

const WEATHERBIT_KEY = process.env.WEATHERBIT_KEY
const MAPBOX_KEY = process.env.MAPBOX_KEY
const PIXABAY_KEY = process.env.PIXABAY_KEY

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));
app.use((err, req, res, next) => {
    handleError(err, res);
});

// Landing page
app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});

app.post('/location', async(req, res)=> {
    country = req.body.country;
    name = req.body.cityName;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${name}.json?country=${country}&access_token=${MAPBOX_KEY}`;

    try {
        const response = await fetchData(url);

        if (response.hasOwnProperty('message')){
            throw new ErrorHandler(404, response.message);
        }
        else if (response.features.length === 0) {
            throw new ErrorHandler(404, 'The city does not exists');
        }
        else
        {
            res.send(response)
        }
    } catch (error) {
        console.log("error", error)
        res.status(error.statusCode).send(error);
    }
});

app.post('/weekForecast', async(req, res)=>{
    const lat = req.body.latitude;
    const lon = req.body.longitude;

    const url =`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHERBIT_KEY}`

    try{
       res.send(await fetchData(url))
    } catch (error)
    {
        console.log("error", error)
    }
});

app.post('/normalForecast', async(req, res)=> {
    const lat = req.body.latitude;
    const lon = req.body.longitude;
    const day = req.body.day
    const month = req.body.month

    const url = `https://api.weatherbit.io/v2.0/normals?lat=${lat}&lon=${lon}&start_day=${month}-${day}&end_day=${month}-${day}&tp=daily&key=${WEATHERBIT_KEY}`

    res.send(await fetchData(url));
});

app.post('/picture', async(req, res)=>{
    const url =`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${req.body.city}&image_type=photo`
    try{
        res.send(await fetchData(url));
    } catch {
        console.log("error", error)
    }
});

async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}



// Designates what port the app will listen to for incoming requests
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
});
