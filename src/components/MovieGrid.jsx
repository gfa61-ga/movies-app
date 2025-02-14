import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../config";
import Filters from "./Filters";
import MovieCard from "./MovieCard";
import { FavoritesContext } from "../context/FavoritesContext";

function MovieGrid() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialYear = searchParams.get("year") || "all";
  const initialGenre = searchParams.get("genre") || "all";
  const initialType = searchParams.get("type") || "top_rated";

  const [filters, setFilters] = useState({
    year: initialYear,
    genre: initialGenre,
    type: initialType,
  });
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { favorites } = useContext(FavoritesContext);

  // Ref for the observer
  const observer = useRef();
  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchMovies = async (pageNum, currentFilters) => {
    setLoading(true);
    const { year, genre, type } = currentFilters;
    let url = "";
    if (type === "top_rated") {
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=vote_average.desc&vote_count.gte=50&page=${pageNum}`;
    } else {
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=release_date.desc&vote_count.gte=50&page=${pageNum}`;
    }
    if (year !== "all") {
      url += `&primary_release_year=${year}`;
    }
    if (genre !== "all") {
      url += `&with_genres=${genre}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
      setHasMore(pageNum < data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // When filters change, update URL and reset movies
  useEffect(() => {
    setSearchParams(filters);
    if (filters.genre !== "favorites") {
      setMovies([]);
      setPage(1);
      fetchMovies(1, filters);
    } else {
      // For favorites, load from context
      setMovies(favorites);
      setHasMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, favorites]);

  // Fetch more movies when page changes (for non-favorites view)
  useEffect(() => {
    if (filters.genre !== "favorites" && page !== 1) {
      fetchMovies(page, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <Filters filters={filters} onFilterChange={setFilters} />
      <div className="movie-grid">
        {movies.map((movie, index) => {
          if (movies.length === index + 1) {
            return (
              <div ref={lastMovieElementRef} key={movie.id}>
                <MovieCard
                  movie={movie}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              </div>
            );
          } else {
            return (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            );
          }
        })}
      </div>
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default MovieGrid;
