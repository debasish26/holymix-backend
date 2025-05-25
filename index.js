const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();
const request = require("request");
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "https://holymix.live",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());


// ✅ Home Page
app.get("/api/hianime/home", async (req, res) => {
    console.log("Home Page");
    try {
        const response = await axios.get("https://aniwatch-api-sage-nu.vercel.app/api/v2/hianime/home");
        res.json(response.data);
    } catch (error) {
        console.error("Backend fetch error:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
});

// ✅ Anime Info
app.get("/api/anime/info/:id", async (req, res) => {
    try {
        const animeId = req.params.id;
        const response = await axios.get(`https://aniwatch-api-sage-nu.vercel.app/api/v2/hianime/anime/${animeId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the data" });
    }
});

// ✅ Episodes List
app.get("/api/episode/:id", async (req, res) => {
    try {
        const animeId = req.params.id;
        const response = await axios.get(`https://aniwatch-api-sage-nu.vercel.app/api/v2/hianime/anime/${animeId}/episodes`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the data" });
    }
});

// ✅ Fetch Episode Sources
app.get("/api/episode/sources/:episodeId/:episodeNumber/:category", async (req, res) => {

    const { episodeId, episodeNumber, category } = req.params;

    console.log("Received request with Episode ID:", episodeId, "Category:", category);

    if (!episodeId || !category) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const response = await axios.get(
            `https://aniwatch-api-sage-nu.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}?${episodeNumber}&server=hd-1&category=${category}`
        );

        console.log("Fetched video source:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching episode sources:", error.message);
        res.status(500).json({ error: "Failed to fetch episode sources" });
    }
});

// ✅ Anime Search
app.get("/api/search/:q", async (req, res) => {
    const query = req.params.q;
    console.log("Received query:", query);

    try {
        const response = await axios.get(
            `https://aniwatch-api-sage-nu.vercel.app/api/v2/hianime/search/suggestion?q=${query}`
        );

        console.log("Fetched search suggestion:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        res.status(500).json({ error: "Failed to fetch search results" });
    }
});

// ✅ Fetch Anime by Genre
app.get("/api/genre/:genreName", async (req, res) => {
    const genre = req.params.genreName.toLowerCase();

    console.log(`Fetching genre: ${genre}`);

    try {
        const response = await axios.get(
            `https://aniwatch-api-sage-nu.vercel.app/api/v2/hianime/genre/${genre}?page=1`
        );
        console.log("Fetched genres data",response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching genre data:", error.message);
        res.status(500).json({ error: "Failed to fetch genre data" });
    }
});


// ✅ Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
