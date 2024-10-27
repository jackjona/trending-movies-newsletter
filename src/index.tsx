import { Hono } from "hono";

const app = new Hono();

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

app.fire; // Not needed with Cloudflare Workers

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

export default app;
