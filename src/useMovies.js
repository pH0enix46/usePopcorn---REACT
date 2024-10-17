// // //
import { useState, useEffect } from "react";

// ⏺ Custom hooks are reusable functions in React that allow us to share logic between components while using built-in hooks. It can be any name but must be start with "use". Like here "useMovies"

const KEY = "8649b473";
// ⏺ remember this is a function not components
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    // ⏺ first argument is a function(any type)
    function () {
      // callback?.();

      const controller = new AbortController(); // ⏺ AbortController() (browser API) is a JS object used to cancel or abort web requests like fetch() before they complete

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); // ⏺ reset the error

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          // console.log(res)
          if (!res.ok)
            throw new Error("Something went wrong!! with fetching movies!");

          const data = await res.json();

          // console.log(data);
          if (data.Response === "False") throw new Error("Movie not found!!");

          setMovies(data.Search);
          // console.log(data.Search)
          // console.log(movies);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            // console.error(err.message);
            // console.log(err.name);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      // ⏺ cleanup function
      return function () {
        controller.abort(); // ⏺ abort() is a method of AbortController that cancel a web request when called
      };
    },
    [
      // ⏺ second argument is an array of dependencies. It tells React when to re-run the effect. If any value in the array changes, the effect runs again. If empty [] it runs only once after the first render

      query,
    ]
  );

  return {
    movies,
    isLoading,
    error,
  };
}
