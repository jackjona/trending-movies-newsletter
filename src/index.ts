import { Hono } from "hono";
import { Resend } from "resend";
import { MovieTemplate } from "./emails/movie-template";
// import { EmailTemplate } from "./emails/email-template";
import { renderToString } from "react-dom/server";
import MockData from "./data/mock-data.json";

// Get the secrets and api keys from the (local) .dev.vars file
type Bindings = {
  TMDB_KEY: string;
  RESEND_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Function to fetch the trending movies of the week using the TMDB API
async function getTrendingMovies(c) {
  const TMDB_KEY = c.env.TMDB_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`
  );
  const data = await response.json();
  return data.results;
}

// Route to preview the email
app.get("/", async (c) => {
  try {
    const movies = MockData;
    const emailContent = renderToString(MovieTemplate({ movies }));
    return c.html(emailContent);
  } catch (err) {
    console.error("Caught error:", err);
    return c.json(
      { message: "Failed to preview email", error: err.message },
      500
    );
  }
});

// Route to send the email
app.get("/send", async (c) => {
  try {
    const resend = new Resend(c.env.RESEND_KEY);
    const movies = await getTrendingMovies(c);
    // const htmlContent = generateHtmlContent(movies);

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Movie Template Test",
      react: MovieTemplate({ movies }),
      // react: EmailTemplate({ firstName: "John" }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return c.json(error, 400);
    }

    return c.json(data);
  } catch (err) {
    console.error("Caught error:", err);
    return c.json({ message: "Failed to send email", error: err.message }, 500);
  }
});

// Route to fetch the data in JSON format
app.get("/data", async (c) => {
  try {
    const movies = await getTrendingMovies(c);
    return c.json(movies);
  } catch (err) {
    console.error("Caught error:", err);
    return c.json({ message: "Failed to fetch data", error: err.message }, 500);
  }
});

/* 
const resend = new Resend(c.env.RESEND_KEY);

export async function sendEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Test email",
      react: <EmailTemplate firstName="John" />,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(JSON.stringify(error));
    }

    return data;
  } catch (err) {
    console.error("Caught error:", err);
    throw new Error("Failed to send email");
  }
}

async function getTrendingMovies(c) {
  const TMDB_KEY = c.env.TMDB_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`
  );
  const data = await response.json();
  return data.results;
}

function generateHtmlContent(movies) {
  const movieList = movies
    .map(
      (movie) => `
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-xl font-bold">
        ${movie.title}${
        movie.title !== movie.original_title ? ` (${movie.original_title})` : ""
      } - <strong>Rating: ${Math.round(movie.vote_average * 10)}%</strong>
      </h2>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
        movie.title
      } poster" class="w-full h-auto mb-4">
      <p class="text-gray-600">${movie.overview}</p>
      <a  target="_blank" rel="noopener noreferrer" href=https://www.themoviedb.org/movie/${
        movie.id
      }>https://www.themoviedb.org/movie/${movie.id}</a>
    </div>
  `
    )
    .join("");

  return `
    <div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 class="text-2xl font-bold mb-4">Trending Movies of the Week</h1>
      ${movieList}
    </div>
  `;
}

app.get("/", async (c) => {
  try {
    const movies = await getTrendingMovies(c);
    const htmlContent = generateHtmlContent(movies);
    await sendEmail(); // Call the sendEmail function here
    return c.html(htmlContent);
  } catch (error) {
    return c.text(error.message, 500);
  }
});
 */

export default app;
