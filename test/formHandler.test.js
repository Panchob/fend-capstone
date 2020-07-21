const { diffBetweenTodayAndDate, coordinates, weekForecast } = require('../src/client/js/formHandler')

test('Correct calculation of difference between two dates', () =>{
    const date1 = new Date(2020, 5, 8);
    const date2 = new Date(2020, 5, 5);
    expect(diffBetweenDays(date1, date2)).toBe(3);
});


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
