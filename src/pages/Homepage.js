import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Logo from '../images/Logo.png';
import Menu from '../images/Menu.png';
import Rating from '../images/Rating.png';
import watchTrailer from '../images/watchTrailer.png';
import '../App.css';

const Homepage = () => {
  const API_URL = 'https://api.themoviedb.org/3';
  const BACKGROUND_IMAGE_PATH = 'https://image.tmdb.org/t/p/w1280/';
  const API_KEY = '42486eb24e530fd06d7241d3330e3684'; // Replace with your actual TMDB API key
  const ITEMS_PER_PAGE = 12; // Number of movies per page
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [searchKey, setSearchKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBestMovies = async () => {
    const { data } = await axios.get(`${API_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        sort_by: 'popularity.desc',
      },
    });
    setMovies(data.results.slice(0, 12)); // Get the best 5 movies
  };

  const fetchMoviesBySearch = async (searchKey) => {
    const { data } = await axios.get(`${API_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(data.results);
  };

  useEffect(() => {
    if (searchKey) {
      fetchMoviesBySearch(searchKey);
    } else {
      fetchBestMovies();
    }
  }, [searchKey]);

  const renderMovies = () =>
    movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} selectMovie={setSelectedMovie} />
    ));

  const handlePaginationClick = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const paginationButtons = [];

  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePaginationClick(i)}
        className={currentPage === i ? 'active' : ''}
      >
        {i}
      </button>
    );
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page when searching
    fetchMoviesBySearch(searchKey);
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
          <form onSubmit={handleSearchSubmit}>
            <input
              type={'text'}
              placeholder={'What do you want to watch?'}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="search">Search</button>
          </form>
          <p className={'title'}>
            <img src={Menu} alt="signup" />
          </p>
        </header>
        <div className={'info-content'}>
            <h1>{selectedMovie.title}</h1>
            <img src={Rating} alt="Rating" />
            <p>{selectedMovie.overview}</p>
            <img src={watchTrailer} alt='watch trailer' />
        </div>
      </div>
      <div className="container">
        {renderMovies().slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
        )}
      </div>
      <div className="pagination">{paginationButtons}</div>
    </div>
  );
};

export default Homepage;
