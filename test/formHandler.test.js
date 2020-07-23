const {coordinates, weekForecast } = require('../src/client/js/formHandler')


test('Correct coordinates', async ()=>{
    const expectedRes = {
        'latitude':-78.1018,
        'longitude': 48.5668
    }

    const data = await coordinates('Amos', 'Canada');
    expect(data).toEqual(expectedRes);
});

test('Error: country does not exist', async ()=>{
    expect(async() => await coordinates('Amos', 'Kalimdor').toThrow());
});
