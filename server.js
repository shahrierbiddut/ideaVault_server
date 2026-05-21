require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const commentRoutes = require("./routes/commentRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const publicRoutes = require("./routes/publicRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const envClientUrls = (process.env.CLIENT_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
    process.env.CLIENT_URL,
    ...envClientUrls,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
].filter(Boolean);

const isLocalDevOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

const validateStartupEnv = () => {
    const requiredVars = ["MONGODB_URI", "JWT_SECRET"];
    const missingVars = requiredVars.filter((name) => !process.env[name]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required env vars: ${missingVars.join(", ")}`);
    }

    const firebaseVars = [
        process.env.FIREBASE_PROJECT_ID,
        process.env.FIREBASE_CLIENT_EMAIL,
        process.env.FIREBASE_PRIVATE_KEY,
    ];
    const hasPartialFirebaseConfig = firebaseVars.some(Boolean) && !firebaseVars.every(Boolean);
    if (hasPartialFirebaseConfig) {
        console.warn("[startup] Partial Firebase env detected. Google auth may fail unless FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are all provided.");
    }

    if (process.env.FIREBASE_PRIVATE_KEY) {
        const normalizedPrivateKey = process.env.FIREBASE_PRIVATE_KEY.includes("\\n")
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
            : process.env.FIREBASE_PRIVATE_KEY;
        const hasPemMarkers = normalizedPrivateKey.includes("-----BEGIN PRIVATE KEY-----") &&
            normalizedPrivateKey.includes("-----END PRIVATE KEY-----");

        if (!hasPemMarkers) {
            console.warn("[startup] FIREBASE_PRIVATE_KEY appears malformed. Include full PEM markers: -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----.");
        }
    }

    if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET === "yourStrongSecretKey") {
        console.warn("[startup] JWT_SECRET appears to be a default placeholder. Rotate before production usage.");
    }
};

app.use(helmet());
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked origin: ${origin}`));
        },
        credentials: true,
    })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);

app.get("/", (req, res) => {
    res.status(200).send("IdeaVault Server is Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/public", publicRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async() => {
    try {
        validateStartupEnv();
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();