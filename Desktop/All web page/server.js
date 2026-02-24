import express from "express";
import Colors from "colors";
import Dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authroutes from "./routes/authRSoute.js";

// configure env
Dotenv.config();

// databases config
connectDB();

// rest object..
const app = express();

//middelwares
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/v1/auth', authroutes);

// rest api
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the new world web page.</h1>')
});

// Port
const PORT = process.env.PORT || 8080;

// run listen
app.listen(PORT, () => {
    console.log(`server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgBlue.white);
});
