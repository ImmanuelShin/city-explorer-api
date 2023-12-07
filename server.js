require('dotenv').config();

const PORT = 3000;

const weatherModule = require('./weather');
const movieModule = require('./movies');

const cors = require('cors');
const express = require('express');

const app = express();

// Middleware

app.use(cors());

app.get('/', (request, response) => {
  response.send('Backend represent');
});

app.get('/weather', weatherHandler);
app.get('/movies', moviesHandler);

app.use('*', errorHandler);


// Functions

async function weatherHandler(request, response, next) {
  const { lat, lon } = request.query;

  try {
    const forecasts = await weatherModule.getWeather(lat, lon);
    response.json(forecasts);
  } catch (error) {
    next(error);
  }
}

async function moviesHandler(request, response, next) {
  try {
    const movies = await movieModule.getMovies();
    response.send(movies);
  } catch (error) {
    next(error);
  }
}

// Errors

function errorHandler(error, request, response, next) {
  console.log('helpas');
  console.log(error.response.data);

  const statusCode = error.response.data.status_code || 500;
  const errorMessage = error.response.data.status_message || 'Internal Server Error';

  response.status(statusCode).json({
    errorCode: statusCode,
    message: errorMessage,
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
