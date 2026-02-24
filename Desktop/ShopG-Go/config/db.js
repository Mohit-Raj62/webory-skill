import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to MongoDB  Database ${conn.connection.host}`.bgCyan.bgBlack);;
    } catch (error) {
        console.log(`Error connecting to MongoDB ${Error}`.bgCyan.white);
    }
};

export default connectDB;