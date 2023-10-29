import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { key } from "../App";
import { Loader } from "./Loader";

export function MovieDetails({
  selectedMovieID,
  onCloseMovie,
  handleAddToWatched,
  userRate,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newMovie = {
      imdbID: selectedMovieID,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating: rating,
    };
    handleAddToWatched(newMovie);
    onCloseMovie();
  }
  useEffect(() => {
    function callback(e) {
      if (e.key === "Escape") onCloseMovie();
    }
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovie]);
  useEffect(() => {
    async function fetchMovie() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&i=${selectedMovieID}`
        );
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovie();
  }, [selectedMovieID]);
  useEffect(() => {
    if (!title) return;
    document.title = `${title} | usePopcorn`;
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {userRate ? (
                <p className="rated">
                  You rated this movie {userRate} <span>&#11088;</span>
                </p>
              ) : (
                <>
                  <StarRating maxRating={10} onSetRating={setRating} />
                  {rating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
