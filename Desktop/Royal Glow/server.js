import express from "express";
import colors from "colors";
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import Cors from "cors";
// import path from "path"
// import { fileURLToPath } from "url";

// configure 
dotenv.config()

// database 
connectDB();


// esmodules fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// rest object  
const app = express();

// middleware   
app.use(Cors());
app.use(express.json());
app.use(morgan('dev'));
// app.use(express.static(path.json(__dirname, './client/build')));

// routes   
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

//  rest api 
app.get('/', (req, res) => {
    res.send('<h1>Hello user !</h1>');
})
// app.use('*', function (req, res) {
//     res.sendFile(path.join(__dirname, './client/build/index.html'))
// })
// port
const PORTS = process.env.PORTS || 8080;
// app listening   
app.listen(PORTS, () => {
    console.log(`server listening on ${process.env.DEV_MODE} mode  on port ${PORTS}`.bgWhite.black)
});