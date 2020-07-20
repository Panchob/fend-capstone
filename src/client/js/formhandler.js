import { validText } from "./validateInput";
import regeneratorRuntime from "regenerator-runtime";
const fetch = require("node-fetch");


function createTrip(event){
    event.preventDefault();

    const city = document.getElementById('inputLocation').value;
    const country = document.getElementById('inputCountry').value;

    
    coordinates(city, country)
    .then((forecastData) => {

        Promise.all([getForecast(forecastData), picture("http://localhost:8010/picture", {city:city})])
        .then((data) => {
            const tripInfo = {
                'city': city,
                'country': country,
                'imageURL': data[1]
            }
            showTrip(tripInfo)
        })
    });
};

function showTrip(data){
    const tripHtml = `
    <div class="trip">
        <div class="picture">
            <img src=${data.imageURL}>
        </div>
        <div class='description'>
            <p class="desTile">My trip to:${data.city, data.country} </p>
            <p class="desTile">Departing: date</p>
            <div class="inputButtons">
                <input class="btn saveBtn" id ="mainSaveBtn" type="submit" name="" value="save trip">
                <input class="btn removeBtn" id ="mainRemoveBtn"type="submit" name="" value="remove trip">
            </div>
            <p class="desElem">${data.city} is:  away</p>
        </div>
    </div>
     `
    
    document.getElementById('tripContainer').insertAdjacentHTML("afterbegin", tripHtml);
}



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

const weekForecast = async(url='', data={}) => {

    const res = await fetch(url, getOptions(data));

    try {

        return await res.json();
        
    } catch(error) {
        console.log("error", error );
    }
}

const normalForecast = async(url='', data={}) => {
    
    const res = await fetch(url, getOptions(data));

    try{
        return await res.json();

    } catch(error) {
        console.log("error", error);
    }
}

const picture = async(url='', data={}) => {

    const res = await fetch(url, getOptions(data));

    try{
        const picture = await res.json();

        if (picture.total == 0) {
            //Todo: find a placeholder
        } else {
            console.log(picture)
            return picture.hits[0].webformatURL
        }
       
    } catch {
        console.log("error", error);
    }
}
const coordinates = async(city, country) => {
    try{
        const countryCodeRes = await(fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`));

        if (countryCodeRes.status == 404) {
            throw new Error('Country does not exist')
        }

        const countryCode = await countryCodeRes.json();
        return await location('http://localhost:8010/location', {cityName: city, country: countryCode[0].alpha2Code});

    } catch(error) {
        console.log("error", error)
    }
}

async function getForecast(forecastData) {
    const tripDate = new Date(document.getElementById('inputDate').value);
    const todayDate = new Date();

    const diff = diffBetweenDays(tripDate, todayDate);

    if (diff < 0) {
        throw new Error('Trip date must in the future')
    }

    if (diff > 7) {
        forecastData["day"] = tripDate.getDay();
        forecastData["month"] = tripDate.getMonth();
        

        return await normalForecast('http://localhost:8010/normalForecast', forecastData);

    } else {

        return await weekForecast('http://localhost:8010/weekForecast', forecastData );
    }
}

function diffBetweenDays(date1, date2) {

    if ( date1 === undefined || date2 === undefined) {
        throw new Error('Both dates must be provided');
    }

    const diffInTime = date1.getTime() - date2.getTime();
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

export { createTrip, diffBetweenDays, coordinates, weekForecast }