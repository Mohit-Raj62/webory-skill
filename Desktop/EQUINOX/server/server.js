import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
//  routes imports
import testRoutes from "./routes/testRoutes.js";
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// dot Env config
dotenv.config();

// dattabase conn
connectDB();

// cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// reat object
const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes api
app.use("/api/v1", testRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

// routes
app.get("/", (req, res) => {
  return res.status(200).send("<h>Welcome to Equinox</h>");
});

// port & env
const PORT = process.env.PORT || 8080;

// listen port
app.listen(PORT, () => {
  console.log(
    `server running on PORT ${process.env.PORT} on port ${process.env.NODE_ENV}... `
      .bgBlue.bgWhite
  );
});
