import {
  Body,
  Container,
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
import { CSSProperties } from "react";
import { CurrentWeek } from "../utils/CurrentWeek";

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

export const MovieTemplate: React.FC<Readonly<MovieTemplateProps>> = ({
  movies,
}) => {
  const weekStartDate = CurrentWeek();
  const previewText = `Check out these trending movies for the week of ${weekStartDate}`;

  return (
    <Html>
      {/* <Head>
        <title>{`Trending movies for the week of ${weekStartDate}.`}</title>
      </Head> */}
      <Preview>{previewText}.</Preview>
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
          <Section style={wrapper}>
            <Text style={heading}>Trending Movies</Text>
            <Text>{previewText}.</Text>
            <Hr style={hr} />
            {movies.map((movie) => (
              <Row key={movie.id} style={movieContainer}>
                <Img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  width="120px"
                  style={movieImage}
                />

                <Text style={movieTitle}>
                  {movie.title}
                  <span style={ratingStyle}>
                    {" "}
                    Rating: {Math.round(movie.vote_average * 10)}%
                  </span>
                </Text>
                <Text style={movieOverview}>{movie.overview}</Text>
                <Link
                  href={`https://www.themoviedb.org/movie/${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={movieLink}
                >
                  View on TMDB
                </Link>
              </Row>
            ))}
          </Section>

          <Section style={footer}>
            <Row>
              <Text style={footerText}>
                This product uses the TMDb API but is not endorsed or certified
                by TMDb.
              </Text>
              <Img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
                alt="TMDB Logo"
                width="50px"
                style={logoImage}
              />
            </Row>
            {/* Add Github link once repo is public */}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// CSS Styling
const main: CSSProperties = {
  backgroundColor: "#ffffff",

  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container: CSSProperties = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const wrapper: CSSProperties = {
  textAlign: "center",
};

const heading: CSSProperties = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#7953cd",
};

const hr: CSSProperties = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
const movieContainer: CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid #e2e8f0",
};

const movieImage: CSSProperties = {
  height: "auto",
  borderRadius: "6%",
  margin: "auto",
  paddingTop: "10px",
};

const movieTitle: CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: "bold",
};

const ratingStyle: CSSProperties = {
  backgroundColor: "#daa520",
  fontSize: "0.8rem",
  borderRadius: "4px",
  padding: "2px",
  marginLeft: "6px",
};

const movieOverview: CSSProperties = {
  color: "#4a5568",
};

const movieLink: CSSProperties = {
  color: "#01b4e4",
  display: "block",
  textDecoration: "underline",
};

const footer: CSSProperties = {
  marginBottom: "10px",
  margin: "auto",
};

const footerText: CSSProperties = {
  textAlign: "center",
  color: "#9ca299",
  fontSize: "14px",
};

const logoImage: CSSProperties = {
  height: "auto",
  margin: "auto",
};
