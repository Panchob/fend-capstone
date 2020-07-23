function removeTrip(elem) {
    const section = document.getElementById(elem.getAttribute('tripId'));
    section.parentNode.removeChild(section);
}

function removeAllTrips() {
    const section = document.getElementById("tripContainer");
    section.removeChild();
}

export {removeTrip, removeAllTrips}