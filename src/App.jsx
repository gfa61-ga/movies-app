import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieGrid from "./components/MovieGrid";
import MovieDetails from "./components/MovieDetails";

function App() {
  return (
    <Router basename="/movies-app/">
      <Routes>
        <Route path="/" element={<MovieGrid />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
