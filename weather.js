const axios = require('axios');

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

async function getWeather(lat, lon) {
  const url = `https://api.weatherbit.io/v2.0/current?units=I&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;

  try {
    const weatherResponse = await axios.get(url);
    const forecasts = weatherResponse.data.data.map((data) => new Forecast(data.weather.description, data.datetime));
    return forecasts;
  } catch (error) {
    console.log('Error fetching weather', error);
    throw error;
  }
}

module.exports = { getWeather };
