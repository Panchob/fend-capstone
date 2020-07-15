import { validText, validDate } from "./validateInput"

function createTrip(event){
    event.preventDefault()

    
    coordinates()
    .then((res) => {
        console.log(res)
    });

    forecast()

}


const location = async(url='', data={}) => {
    const res = await fetchURL(url, data)
    try{
        const locations = await res.json();
        const coordinates = locations.features[0].geometry.coordinates
        const response = {
            "latitude": coordinates[0],
            "longitude": coordinates[1]
        }
        return response;
    }catch(error){
        console.log("error", error );
    }
};

async function fetchURL(url, data){
    // TODO: To put in a variable, not a function.
    return await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

const coordinates = async() => {
    // TODO: TEST!
    const city = document.getElementById('inputLocation').value;
    const country = document.getElementById('inputCountry').value;

    const res = await( fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`));
    const countryCode = await res.json();
    const coordinates = await location('http://localhost:8010/location', {cityName: city, country: countryCode[0].alpha2Code});

    return coordinates
}

const forecast = async(coordinates) => {
    // TODO: parse DATE. TEST!
    const tripDate = new Date(document.getElementById('inputDate').value);
    const todayDate = new Date();

    const diffInTime = tripDate.getTime() - todayDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    console.log(diffInDays);

}

export { createTrip }