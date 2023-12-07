require('dotenv').config();

const PORT = process.env.PORT || 3000;
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();


// Middleware

app.use(cors());

app.get('/', (request, response) => {
  response.send('Backend represent');
});

app.get('/weather', getWeather);
app.get('/movies', getMovies);

app.use('*', errorHandler);


// Functions

async function getWeather(request, response, next) {
  const { lat, lon } = request.query;

  const url = `https://api.weatherbit.io/v2.0/current?units=I&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;

  try {
    const weatherResponse = await axios.get(url);
    const forecasts = weatherResponse.data.data.map((data) => new Forecast(data.weather.description, data.datetime));
    response.json(forecasts);
  } catch (error) {
    console.log('Error fetching weather', error);
    next(error);
  }
}

async function getMovies(request, response, next) {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_release_type=2`;

  try {
    const movieResponse = await axios.get(url);
    const movies = movieResponse.data.results.map(m => new Movies(m.title, m.overview, m.vote_average, m.vote_count, m.poster_path, m.popularity, m.release_date));
    response.send(movies);
  } catch (error) {
    console.log('Error fetching movie', error);
    next(error);
  }

}

// Errors

function errorHandler(error, request, response, next) {
  console.error(error.stack);
  response.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
  });
}

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

class Movies {
  constructor(title, overview, avg_votes, ttl_votes, img_url, pop, release) {
    this.title = title;
    this.overview = overview;
    this.avg_votes = avg_votes;
    this.ttl_votes = ttl_votes;
    this.img_url = 'https://image.tmdb.org/t/p/w500' + img_url;
    this.pop = pop;
    this.release = release;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
