const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/api/load", (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let progress = 0;

  // Send progress updates every second
  const interval = setInterval(() => {
    progress += 10;

    if (progress <= 100) {
      res.write(`data: ${progress}\n\n`);
    }

    if (progress > 100) {
      clearInterval(interval);
      res.write("data: complete\n\n");
      res.end();
    }
  }, 1000);

  // Handle client disconnect
  req.on("close", () => {
    clearInterval(interval);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
