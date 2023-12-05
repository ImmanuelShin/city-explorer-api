require('dotenv').config();

const PORT = process.env.PORT || 3000;

const cors = require('cors');
const express = require('express');
const weatherData = require('./data/weather.json');
const app = express();

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

app.get('/', (request, response) => {
  response.send('Hello from the backend server!');
});

app.get('/weather', (request, response, next) => {
  const { lat, lon, searchQuery } = request.query;

  const result = weatherData.find((city) => {
    return (
      city.lat === lat &&
      city.lon === lon &&
      city.city_name.toLowerCase() === searchQuery.toLowerCase()
    );
  });

  if (result) {
    console.log('made results');
    const forecasts = result.data.map((forecastData) => {
      return new Forecast(forecastData.weather.description, forecastData.datetime);
    });

    response.send(forecasts);
  } else {
    const error = new Error('City not found');
    error.status = 404;
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
  });
});

app.use(cors());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
