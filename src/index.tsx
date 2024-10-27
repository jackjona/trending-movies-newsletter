import { Hono } from "hono";

interface RateLimit {
  download_limit: number;
  download_limit_used: number;
  transfer_limit: number;
  transfer_limit_used: number;
}

// Utility function for handling (type) errors
function handleError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

const app = new Hono();

// Array of allowed domains used for the proxy origin
const allowedDomains = ["pixeldrain.com", "cdn.pixeldrain.com"];

// Rate limit JSON response
app.get("/limit", async (context) => {
  try {
    let response = await fetch("https://pixeldrain.com/api/misc/rate_limits");
    let data = (await response.json()) as RateLimit;
    return context.json(data);
  } catch (error) {
    return context.text(`Error: ${handleError(error)}`, 500);
  }
});

// Handle PROXY request and response
app.get("/proxy", async (c) => {
  try {
    let url = new URL(c.req.url);
    let originUrl = url.searchParams.get("origin");

    if (!originUrl) {
      return c.text("Bad Request: Missing origin parameter", 400);
    }

    if (new URL(originUrl).protocol !== "https:") {
      return c.text("Unauthorized: Only HTTPS protocol is allowed", 403);
    }

    console.log(originUrl);
    if (!allowedDomains.includes(new URL(originUrl).hostname)) {
      return c.text("Unauthorized: This domain is not in the whitelist", 403);
    }

    let newRequest = new Request(originUrl, c.req);
    let response = await fetch(newRequest);
    let newResponse = new Response(response.body, response);
    newResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return newResponse;
  } catch (error) {
    return c.text(`Error: ${handleError(error)}`, 500);
  }
});

// Index (root) TEXT response
app.get("/", (c) => {
  return c.text("Hello Hono! TEXT");
});

// Fetch external & JSON response
app.get("/quotes", async (c) => {
  try {
    const response = await fetch("https://animechan.io/api/v1/quotes/random");
    const data = await response.json();

    return c.json({
      success: true,
      date: new Date(),
      data,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch external API",
      },
      500
    );
  }
});

// Raw response
app.get("/morning", (c) => {
  return new Response("Good morning!");
});

// JSON response
app.get("/api/hello", (c) => {
  return c.json({
    success: true,
    date: new Date(),
    message: "Hello Hono! JSON",
  });
});

// Dynamic query and param TEXT response
app.get("/welcome/:name", (c) => {
  const userID = c.req.query("user");
  const name = c.req.param("name");
  c.header("X-Message", "Hi!");
  return c.text(
    `Welcome ${name}! Your user ID is: ${userID ? userID : "not found"}`
  );
});

// Return HTML including public image
const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
        <img src="./static/image.png" />
      </body>
    </html>
  );
};

app.get("/page", (c) => {
  return c.html(<View />);
});

app.fire; // Not needed with Cloudflare Workers

export default app;
