# Trip planner

The goal of this project is to connect multiple API together:

1. Country code from RESTCountry
2. Coordinates of a city with MapBox
3. Forecast of a location for a given date with WeatherBit
4. A picture of a given city with Pixabay

This webpage prompt the user with a simple form that takes a city, a country and a date as values. A card will then be generated with the following information:

- A picture of the city (or a generic picture if none exist).

- The name and country visited.

- The forecast if the trip is within the week or the typical weather if more.

## Dependencies

To run locally you must first have [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/) installed.

Then, in the root directory run:

```bash
npm install
```

```bash
npm run build prod
```

```bash
npm start
```

The application will then run on port [8000](http://localhost:8010/).

## Testing

Some tests have been written with Jest. To run then simply input the following command in the root folder:

```bash
npm test
```

To test the endpoints a file is provided in the *test* folder to import to [postman](https://www.postman.com/).