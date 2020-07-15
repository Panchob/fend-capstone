function validText (text) {
    // https://stackoverflow.com/a/22214445/13506641
    var pattern = new RegExp('[a-zA-Z]+');
    return pattern.test(country);
}

function validDate (date) {
    var pattern = new RegExp('([12]\d{3}(-|\/)*(0[1-9]|1[0-2])(-|\/)*(0[1-9]|[12]\d|3[01]))')
    return pattern.test(date);
}

export { validDate, validText }