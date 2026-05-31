import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import aiRoutes from "./routes/aiRoutes";
import artisanRoutes from "./routes/artisanRoutes";
import authRoutes from "./routes/authRoutes";
import nftRoutes from "./routes/nftRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import productRoutes from "./routes/productRoutes";
import workshopRoutes from "./routes/workshopRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
  res.json({
    message: "KaruVerse API Running",
    network: "Celo Sepolia",
    modules: ["auth", "artisans", "products", "ai", "nft", "workshops", "payments"]
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/artisan", artisanRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/nft", nftRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
