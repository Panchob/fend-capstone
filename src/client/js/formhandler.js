import { validText } from "./validateInput";
import regeneratorRuntime from "regenerator-runtime";
const { v4: uuidv4} = require("uuid")
const fetch = require("node-fetch");

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function createTrip(event){
    event.preventDefault();

    const city = document.getElementById('inputLocation').value;
    const country = document.getElementById('inputCountry').value;
    
    coordinates(city, country)
    .then((forecastData) => {

        const tripDate = new Date(document.getElementById('inputDate').value);
        forecastData["date"] = tripDate

        Promise.all([getForecast(forecastData), picture("http://localhost:8010/picture", {searchTerm:city})])
        .then((data) => {
            const tripInfo = {
                'city': city,
                'country': country,
                'imageURL': data[1],
                'date': tripDate,
                'maxTemp': data[0].max_temp,
                'nextWeek': data[0].nextWeek,
                'weather': data[0].weather,
                'minTemp': data[0].min_temp
            }
            showTrip(tripInfo);
        })
    });
};


// Adds a new div containing trip information.
function showTrip(data){
    const formattedDate = `${monthNames[data.date.getMonth()]} ${data.date.getDate()} ${data.date.getFullYear()}`;
    let weather = "";

    if(data.weather) {
        weather = "The weather will be:" + data.weather.description;
    }
    else {
        weather = `The date is too far in the future to know the weather`;
    }

    // Unique id to remove easily
    const id = uuidv4();
    const tripHtml = `
    <div class="trip" id="${id}">
        <div class="picture">
            <img src=${data.imageURL}>
        </div>
        <div class='description'>
            <p class="desTile">My trip to ${data.city} - ${data.country} </p>
            <p class="desTile">Departing on ${formattedDate}</p>
            <div class="inputButtons">
                <input class="btn saveBtn" id ="mainSaveBtn" type="submit"  value="save trip">
                <input class="btn removeBtn" tripId=${id} type="submit" value="remove trip" onclick="return Client.removeTrip(this)">
            </div>
            <p class="desElem">Trip to ${data.city} is in ${parseInt(diffBetweenTodayAndDate(data.date))} days</p>
            <p class="desElem">Forecast for this date is:</p>
            <p class="desElem"><strong>High</strong>: ${data.maxTemp} - <strong>Low</strong>: ${data.minTemp} </p>
            <p class="desElem">${weather}</p>
        </div>
    </div>
     `
    
    document.getElementById('tripContainer').insertAdjacentHTML("beforeend", tripHtml);
}


// Fetch lon and lat of a city
// data needed: city name and country
const location = async(url='', data={}) => {

    const res = await fetch(url, getOptions(data));

    try {
        const locations = await res.json();
        const coordinates = locations.features[0].geometry.coordinates
        const response = {
            "latitude": coordinates[1],
            "longitude": coordinates[0]
        }
        return response;
    } catch(error) {
        console.log("error", error );
    }
};

// Needs latitude and longitude
// Fetch forecast for next 7 days
const weekForecast = async(url='', data={}) => {

    const res = await fetch(url, getOptions(data));

    try {

        return await res.json();
        
    } catch(error) {
        console.log("error", error );
    }
}

// Needs latitude, longitude, a month and a date
// fetch normal weather at that time of the year
const normalForecast = async(url='', data={}) => {
    
    const res = await fetch(url, getOptions(data));

    try{
        return await res.json();

    } catch(error) {
        console.log("error", error);
    }
}

// Needs a search term
// fetch an image in the category "trip"
const picture = async(url='', data={}) => {

    const res = await fetch(url, getOptions(data));
    const placeholder = await fetch(url, getOptions({searchTerm:"trip"}))

    try{
        let picture = await res.json();

        if (picture.total == 0) {
            picture = await placeholder.json();
        }

        return picture.hits[0].webformatURL;
       
    } catch(error) {
        console.log("error", error);
    }
}

const coordinates = async(city, country) => {
    try{
        const countryCodeRes = await(fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`));

        if (countryCodeRes.status == 404) {
            throw new Error('Country does not exist');
        }

        const countryCode = await countryCodeRes.json();
        return await location('http://localhost:8010/location', {cityName: city, country: countryCode[0].alpha2Code});

    } catch(error) {
        console.log("error", error);
    }
}

async function getForecast(forecastData) {
    const tripDate = forecastData.date;
    let forecast;
    const diff = diffBetweenTodayAndDate(tripDate);

    if (diff < 0) {
        throw new Error('Trip date must in the future');
    }

    if (diff > 7) {
        forecastData["day"] = tripDate.getDay();
        forecastData["month"] = tripDate.getMonth();
        
        const res =  await normalForecast('http://localhost:8010/normalForecast', forecastData);
        forecast = res.data[0];
    } else {
        const res = await weekForecast('http://localhost:8010/weekForecast', forecastData );
        forecast = res.data[parseInt(diff)];
    }

    return forecast
}

function diffBetweenTodayAndDate(date) {
    const todayDate = new Date();

    if ( date === undefined || todayDate === undefined) {
        throw new Error('Both dates must be provided');
    }

    const diffInTime = date.getTime() - todayDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    return diffInDays;
}

function getOptions(data) {
    return {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
}

export { createTrip, diffBetweenTodayAndDate, coordinates, weekForecast }