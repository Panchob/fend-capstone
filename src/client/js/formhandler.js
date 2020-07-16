import { validText } from "./validateInput";
import regeneratorRuntime from "regenerator-runtime";
const fetch = require("node-fetch");


function createTrip(event){
    event.preventDefault();

    const city = document.getElementById('inputLocation').value;
    const country = document.getElementById('inputCountry').value;
    const tripDate = new Date(document.getElementById('inputDate').value);
    const todayDate = new Date();
    const diff = diffBetweenDays(tripDate, todayDate);

    if (diff < 0) {
        throw new Error('Trip date must in the future')
    }

    coordinates(city, country)
    .then((res) => {
        console.log(res)


        if (diff > 7) {

        } else {
            //console.log(res);
            weekForecast('http://localhost:8010/weekForecast', res );
        }
    });
};


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
        const forecast = await res.json();
        console.log(forecast)

    } catch(error) {
        console.log("error", error );
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