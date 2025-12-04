import express from "express";
import cors from "cors";
import { registerRoutes } from "./server/routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
registerRoutes(app);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Root route
app.get("/", (req, res) => {
    res.send("Backend is running! 🚀 <br> Access the frontend at <a href='http://localhost:5173'>http://localhost:5173</a>");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
