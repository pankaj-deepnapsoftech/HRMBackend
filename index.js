import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db.js";

dotenv.config({
  // path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000)
    console.log(`Server is Working on localhost:${process.env.PORT}`);
  })
  .catch((error) => {
    console.log("Error connecting to database",error);
  });
