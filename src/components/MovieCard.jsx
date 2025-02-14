import React from "react";
import { TMDB_IMAGE_BASE_URL } from "../config";

function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      {movie.poster_path ? (
        <img
          src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title || movie.original_title}
        />
      ) : (
        <div className="no-image">No Image</div>
      )}
    </div>
  );
}

export default MovieCard;
