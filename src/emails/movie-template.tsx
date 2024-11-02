import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface Movie {
  title: string;
  original_title: string;
  vote_average: number;
  poster_path: string;
  overview: string;
  id: number;
}

interface MovieTemplateProps {
  movies: Movie[];
}

// Function to get the start date of the current week and format it
function getCurrentWeekStart() {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  return weekStart.toDateString(); // Format: e.g., "Sun Nov 03 2024"
}

export const MovieTemplate: React.FC<Readonly<MovieTemplateProps>> = ({
  movies,
}) => {
  const weekStartDate = getCurrentWeekStart();
  const previewText = `Check out these trending movies for the week of ${weekStartDate}`;

  return (
    <Html>
      <Head>
        <title>{previewText}</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/*      <Section>
            <Img
              src="https://example.com/static/logo.png"
              width="96"
              height="30"
              alt="Logo"
            />
          </Section>*/}
          <Section>
            <Text style={heading}>Trending Movies</Text>
            {movies.map((movie) => (
              <div key={movie.id} style={movieContainer}>
                <Text style={movieTitle}>
                  {movie.title}
                  {movie.title !== movie.original_title
                    ? ` (${movie.original_title})`
                    : ""}{" "}
                  -{" "}
                  <strong>
                    Rating: {Math.round(movie.vote_average * 10)}%
                  </strong>
                </Text>
                <Img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  style={movieImage}
                />
                <Text style={movieOverview}>{movie.overview}</Text>
                <Link
                  href={`https://www.themoviedb.org/movie/${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={movieLink}
                >
                  View on TMDB
                </Link>
              </div>
            ))}
          </Section>
          <Hr style={hr} />
          <Section>
            <Row>
              <Text style={footer}>
                Company, Inc., 123 Main St, Anytown, USA
              </Text>
              <Link href="https://example.com" style={reportLink}>
                Report unsafe behavior
              </Link>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const movieContainer = {
  padding: "16px",
  borderBottom: "1px solid #e2e8f0",
};

const movieTitle = {
  fontSize: "1.25rem",
  fontWeight: "bold",
};

const movieImage = {
  width: "100%",
  height: "auto",
  marginBottom: "16px",
};

const movieOverview = {
  color: "#4a5568",
};

const movieLink = {
  color: "#ff5a5f",
  display: "block",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
};

const reportLink = {
  fontSize: "14px",
  color: "#9ca299",
  textDecoration: "underline",
};
