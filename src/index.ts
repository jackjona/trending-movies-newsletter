import { Hono } from "hono";
import { Resend } from "resend";
import { MovieTemplate } from "./emails/movie-template";
// import { EmailTemplate } from "./emails/email-template";
import { renderToString } from "react-dom/server";
import MockData from "./data/mock-data.json";

interface Movie {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  [key: string]: any; // This allows for additional keys
}

interface Env {
  TMDB_KEY: string;
}

// Get the secrets and api keys from the (local) .dev.vars file
type Bindings = {
  TMDB_KEY: string;
  RESEND_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Function to fetch the trending movies of the week using the TMDB API
async function getTrendingMovies(c: { env: Env }) {
  const TMDB_KEY = c.env.TMDB_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`
  );
  const data: { results: Movie[] } = await response.json();
  return data.results;
}

// Route to preview the email template
app.get("/", async (c) => {
  try {
    // const movies = MockData;
    const movies = await getTrendingMovies(c);
    const emailContent = renderToString(MovieTemplate({ movies }));
    return c.html(emailContent);
  } catch (err) {
    console.error("Caught error:", err);
    if (err instanceof Error) {
      return c.json(
        { message: "Failed to preview email", error: err.message },
        500
      );
    }
    return c.json(
      { message: "Failed to preview email", error: "Unknown error" },
      500
    );
  }
});

// Route to send the email
app.get("/send", async (c) => {
  try {
    const resend = new Resend(c.env.RESEND_KEY);
    const movies = await getTrendingMovies(c);
    const { data, error } = await resend.emails.send({
      from: "Trending <trending@noreply.jackjona.eu.org>",
      to: ["me@jackjona.eu.org"],
      subject: "Trending Movies This Week",
      react: MovieTemplate({ movies }),
      // react: EmailTemplate({ firstName: "John" }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return c.json(error, 400);
    }

    return c.json({ message: "Email successfully sent", data });
  } catch (err) {
    console.error("Caught error:", err);
    if (err instanceof Error) {
      return c.json(
        { message: "Failed to send email", error: err.message },
        500
      );
    }
    return c.json(
      { message: "Failed to send email", error: "Unknown error" },
      500
    );
  }
});

// Route to fetch the data in JSON format
app.get("/data", async (c) => {
  try {
    const movies = await getTrendingMovies(c);
    return c.json(movies);
  } catch (err) {
    console.error("Caught error:", err);
    if (err instanceof Error) {
      return c.json(
        { message: "Failed to fetch data", error: err.message },
        500
      );
    }
    return c.json(
      { message: "Failed to fetch data", error: "Unknown error" },
      500
    );
  }
});

export default app;
