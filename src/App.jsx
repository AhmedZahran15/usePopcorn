import { useEffect, useState } from "react";
import { MovieDetails } from "./components/MovieDetails";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
import { Box } from "./components/Box";
import { MoviesList } from "./components/MoviesList";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { Main } from "./components/Main.1";
import { Summary } from "./components/Summary";
import { NumResults } from "./components/NumResults";
import { Search } from "./components/Search";
import { Navbar } from "./components/Navbar";
import { useLocalStorageState } from "./custom hooks/useLocalStorageState";
export const key = "c76289d";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedMovieID, setSelectedMovieID] = useState(null);
  const [watched, setWatched] = useLocalStorageState("watched", []);

  function onSelectMovie(id) {
    setSelectedMovieID(id === selectedMovieID ? null : id);
  }
  function onCloseMovie() {
    setSelectedMovieID(null);
  }
  function handleAddToWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    localStorage.setItem("watched", JSON.stringify(watched));
  }
  function removeAddHandle(movie) {
    setWatched((watched) => watched.filter((m) => m.imdbID !== movie.imdbID));
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setError("");
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found!");
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    setSelectedMovieID(null);
    fetchMovies();
    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {error ? (
            <ErrorMessage error={error} />
          ) : isLoading ? (
            <Loader />
          ) : (
            <MoviesList movies={movies} onSelectMovie={onSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedMovieID ? (
            <MovieDetails
              selectedMovieID={selectedMovieID}
              onCloseMovie={onCloseMovie}
              handleAddToWatched={handleAddToWatched}
              userRate={
                watched.find((movie) => movie.imdbID === selectedMovieID)
                  ?.userRating
              }
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                removeAddHandle={removeAddHandle}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
