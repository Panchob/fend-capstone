function validText (text) {
    // https://stackoverflow.com/a/22214445/13506641
    var pattern = new RegExp('[a-zA-Z]+');
    return pattern.test(country);
}

export {validText }