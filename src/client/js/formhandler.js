const { application } = require("express");

document.getElementById('mainSaveBtn').addEventListener('click', createTrip);

function createTrip(e){
    const city = document.getElementById('inputLocation').value
    const date = document.getElementById('inputDate').value

    const locationInfo = location('/location', {cityName:city});
}





const location = async(url='', data={}) =>{
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try{
        const l = await res.json();
        return l
    }catch(error){
        console.log("error", error )
    }
}