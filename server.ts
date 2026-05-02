import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "20mb" }));
  const PORT = 3000;

  // Diagnostic endpoint to check API key status on server side if needed
  app.get("/api/diag", (req, res) => {
    res.json({ 
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasMapsKey: !!process.env.GOOGLE_MAPS_API_KEY,
      env: process.env.NODE_ENV || "development"
    });
  });

  // API route for fetching heritage site photos via Google Places API
  app.get("/api/place-photo", async (req, res) => {
    const query = req.query.query as string;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GOOGLE_MAPS_API_KEY is not configured" });
    }

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const refinedQuery = `${query}, Pakistan`;
    
    try {
      const searchResponse = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.photos,places.displayName",
        },
        body: JSON.stringify({ textQuery: refinedQuery }),
      });

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json();
        return res.status(searchResponse.status).json({ error: "Failed to search for place" });
      }

      const searchData: any = await searchResponse.json();
      const photos = searchData.places?.[0]?.photos;

      if (!photos || photos.length === 0) {
        return res.status(404).json({ error: "No photos found" });
      }

      const photoName = photos[0].name;
      const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${apiKey}`;
      res.redirect(photoUrl);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
