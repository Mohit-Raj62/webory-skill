import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { PrismaClient } from "@prisma/client";
// import jwt from "express-oauth2-jwt-bearer";

// const prisma = new PrismaClient();
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
