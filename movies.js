const axios = require('axios');

class Movies {
  constructor(id, title, overview, avg_votes, ttl_votes, img_url, pop, release) {
    this.id = id;
    this.title = title;
    this.overview = overview;
    this.avg_votes = avg_votes;
    this.ttl_votes = ttl_votes;
    this.img_url = 'https://image.tmdb.org/t/p/w500' + img_url;
    this.pop = pop;
    this.release = release;
  }
}

async function getMovies() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_release_type=2`;

  try {
    const movieResponse = await axios.get(url);
    const movies = movieResponse.data.results.map(m => new Movies(m.id, m.title, m.overview, m.vote_average, m.vote_count, m.poster_path, m.popularity, m.release_date));
    return movies;
  } catch (error) {
    console.log('Error fetching movie', error);
    throw error;
  }
}

module.exports = { getMovies };
