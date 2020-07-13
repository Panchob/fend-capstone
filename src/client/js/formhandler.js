const { application } = require("express");

document.getElementById('mainSaveBtn').addEventListener('click', createTrip);

function createTrip(e){
    const city = document.getElementById('inputLocation').value;
    const date = document.getElementById('inputDate').value;

    location('/location', {cityName:city})
    .then(function(coord) {
        Promise.all([])
    })

}


const location = async(url='', data={}) =>{
    const res = await fetchURL(url, data)
    try{
        const locations = await res.json();
        const coordinates = locations.features[0].geometry.coordinates
        response = {
            "latitude": coordinates[0],
            "longitude": coordinates[1]
        }
        res.send(response);
    }catch(error){
        console.log("error", error )
    }
};

async function fetchURL(url, data){
    return await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}