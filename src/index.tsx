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
const allowedDomains = ["pixeldrain.com", "dl.buzzheavier.com"];

// Handle proxy request and response
// (c) means (context)
app.get("/", async (c) => {
  try {
    let url = new URL(c.req.url);
    let originURL = url.searchParams.get("origin"); // Get the origin URL from the query parameter
    if (!originURL) {
      return c.text("Server is running", 200);
    }

    if (new URL(originURL).protocol !== "https:") {
      return c.text("Unauthorized: Only HTTPS protocol is allowed", 403);
    }
    if (!allowedDomains.includes(new URL(originURL).hostname)) {
      return c.text("Unauthorized: This domain is not in the whitelist", 403);
    }
    // Use the Range header for resuming interrupted downloads
    let range = c.req.header("Range");
    let newRequest;
    if (range) {
      newRequest = new Request(originURL, {
        headers: {
          Range: range,
        },
      });
    } else {
      newRequest = new Request(originURL);
    }

    let response = await fetch(newRequest);
    let contentLength = response.headers.get("Content-Length");
    if (contentLength === null) {
      contentLength = "0"; // default to 0 if Content-Length is null
    }

    let newResponse = new Response(response.body, {
      status: range ? 206 : 200,
      headers: response.headers,
    });

    if (range) {
      let bytes = range.replace(/bytes=/, "").split("-");
      let start = parseInt(bytes[0], 10);
      let end = bytes[1]
        ? parseInt(bytes[1], 10)
        : parseInt(contentLength, 10) - 1;
      newResponse.headers.set(
        "Content-Range",
        `bytes ${start}-${end}/${contentLength}`
      );
    }

    newResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return newResponse;
  } catch (error) {
    return c.text(`Error: ${handleError(error)}`, 500);
  }
});

// Rate limit JSON response
app.get("/limit", async (c) => {
  try {
    let response = await fetch("https://pixeldrain.com/api/misc/rate_limits");
    let data = (await response.json()) as RateLimit;
    return c.json(data);
  } catch (error) {
    return c.text(`Error: ${handleError(error)}`, 500);
  }
});

app.get("/origin", (c) => {
  return c.text(`Use origin as a query parameter instead of as a path.`);
});

/* 
----------------------
----Testing Routes---- 
----------------------
*/

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

// app.fire; // Not needed with Cloudflare Workers

export default app;
