import express from "express";
import cors from "cors";
import userRouter from "./router/Router.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Get the directory name using import.meta.url

app.use(
  cors({
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Allow sending cookies with requests
  })
);
app.use(express.json());
app.use(express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//cookie
app.use(cookieParser());

app.use("/api/v1/user", userRouter);

export default app;
