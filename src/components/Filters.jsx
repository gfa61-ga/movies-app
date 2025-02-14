import React, { useState, useEffect } from "react";
import { TMDB_API_KEY } from "../config";

function Filters({ filters, onFilterChange }) {
  const currentYear = new Date().getFullYear();
  // Create an array of years from currentYear down to 1900
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => (currentYear - i).toString()
  );

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch genres from TMDB
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.genres) {
          // Sort genres alphabetically
          const sorted = data.genres.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setGenres(sorted);
        }
      })
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  return (
    <div className="filters">
      <select
        value={filters.year}
        onChange={(e) =>
          onFilterChange({ ...filters, year: e.target.value })
        }
      >
        <option value="all">All</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        value={filters.genre}
        onChange={(e) =>
          onFilterChange({ ...filters, genre: e.target.value })
        }
      >
        {/* “Favorites” pivot to show locally saved movies */}
        <option value="favorites">Favorites</option>
        <option value="all">All</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <div className="toggle">
        <button
          className={filters.type === "top_rated" ? "active" : ""}
          onClick={() => onFilterChange({ ...filters, type: "top_rated" })}
        >
          Top Rated
        </button>
        <button
          className={filters.type === "latest" ? "active" : ""}
          onClick={() => onFilterChange({ ...filters, type: "latest" })}
        >
          Latest Release
        </button>
      </div>
    </div>
  );
}

export default Filters;
