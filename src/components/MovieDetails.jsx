import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from "../config";
import { FavoritesContext } from "../context/FavoritesContext";
import Modal from "./Modal";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);

  useEffect(() => {
    // Fetch movie details
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    // Fetch trailer videos
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await res.json();
        // Select a YouTube video that is either a Trailer or a Teaser
        const ytTrailer = data.results.find(
          (v) =>
            v.site === "YouTube" &&
            (v.type === "Trailer" || v.type === "Teaser")
        );
        setTrailer(ytTrailer);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    // Fetch reviews
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/${id}/reviews?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        setReviews(data.results);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchDetails();
    fetchTrailer();
    fetchReviews();
  }, [id]);

  if (!movie) return <div>Loading movie details...</div>;

  const handleFavoriteToggle = () => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <div className="movie-details">
      <h1>{movie.original_title}</h1>
      <div className="details-top">
        {movie.poster_path ? (
          <img
            src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.original_title}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <div className="info">
          <p>{movie.overview}</p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}
          </p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <button onClick={handleFavoriteToggle}>
            {isFavorite(movie.id)
              ? "★ Remove Favorite"
              : "☆ Add Favorite"}
          </button>
          {trailer ? (
            <button onClick={() => setShowTrailer(true)}>
              Watch Trailer
            </button>
          ) : (
            <p>No trailer available.</p>
          )}
        </div>
      </div>
      <div className="reviews">
        <h2>Reviews</h2>
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <h3>{review.author}</h3>
              <p>{review.content}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
      {showTrailer && trailer && (
        <Modal onClose={() => setShowTrailer(false)}>
          <div className="video-container">
            <iframe
              title="Trailer"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default MovieDetails;
