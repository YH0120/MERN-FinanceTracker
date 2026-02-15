import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import cookieParser from "cookie-parser";
import path from "path"
import transactionRoutes from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()

// middleware
if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        })
    );
}

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);


app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT)
    });
});