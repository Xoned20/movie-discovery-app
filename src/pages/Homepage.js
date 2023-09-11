import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Logo from '../images/Logo.png';
import Menu from '../images/Menu.png';
import Rating from '../images/Rating.png';
import watchTrailer from '../images/watchTrailer.png';
import SearchIcon from '../images/search-icon.svg'; // Import your search icon SVG here
import '../App.css';

const Homepage = () => {
  const API_URL = 'https://api.themoviedb.org/3';
  const BACKGROUND_IMAGE_PATH = 'https://image.tmdb.org/t/p/w1280/';
  const API_KEY = '42486eb24e530fd06d7241d3330e3684'; // Replace with your actual TMDB API key
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [searchKey, setSearchKey] = useState('');
  const [currentTopIndex, setCurrentTopIndex] = useState(0);

  const fetchBestMovies = async () => {
    const { data } = await axios.get(`${API_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        sort_by: 'popularity.desc',
      },
    });
    setMovies(data.results.slice(0, 5)); // Get the best 5 movies
    setSelectedMovie(data.results[0]); // Set the first movie as the selected movie initially
  };

  const fetchMoviesBySearch = async (searchKey) => {
    const { data } = await axios.get(`${API_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(data.results);
    // Only update the selected movie if the current selected movie is different from the first search result
    if (selectedMovie.id !== data.results[0]?.id) {
      setSelectedMovie(data.results[0]);
    }
  };

  useEffect(() => {
    if (searchKey) {
      fetchMoviesBySearch(searchKey);
      setCurrentTopIndex(0); // Reset to the first movie when searching
    } else {
      fetchBestMovies();
    }
  }, [searchKey]);

  const renderMovies = () =>
    movies.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        selectMovie={() => setSelectedMovie(movie)} // Set the selected movie when a card is clicked
      />
    ));

  const handleToggleClick = (index) => {
    setCurrentTopIndex(index);
    // Only update the selected movie if the current selected movie is different from the clicked movie
    if (selectedMovie.id !== movies[index].id) {
      setSelectedMovie(movies[index]);
    }
  };

  return (
    <div className="App">
      <div
        className={'info'}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)) ,url(${BACKGROUND_IMAGE_PATH}${selectedMovie.backdrop_path})`,
        }}
      >
        <header>
          <p className={'title'}>
            <img src={Logo} alt="moviebox" />
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchMoviesBySearch(searchKey);
              setCurrentTopIndex(0); // Reset to the first movie when searching
            }}
          >
            <div className="search-input">
            <input
                type="text"
                placeholder="What do you want to watch?"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                style={{
                backgroundImage: `url('/path/to/your/search-icon.svg')`, // Replace with the actual path to your search icon
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '10px center', // Adjust the position of the icon as needed
                paddingLeft: '40px', // Ensure enough padding to display the icon
                }}/>
            <button type="submit">
                <img src={SearchIcon} alt="Search" />
            </button>
            </div>
          </form>
          <p className={'title'}>
            <img src={Menu} alt="signup" />
          </p>
        </header>
        <div className={'info-content'}>
          {selectedMovie.id && (
            <div className="movie-details">
              <h1>{selectedMovie.title}</h1>
              <img src={Rating} alt="Rating" />
              <p>{selectedMovie.overview}</p>
              <img src={watchTrailer} alt='watch trailer' />
            </div>
          )}
          {movies.length > 0 && (
            <div className="top-movies-toggle">
              {movies.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => handleToggleClick(index)}
                  className={currentTopIndex === index ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="container">{renderMovies()}</div>
    </div>
  );
};

export default Homepage;
