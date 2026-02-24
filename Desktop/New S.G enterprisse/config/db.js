import mongoose from "mongoose";
import Colors, { bgRed }  from "colors";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connecting to mongodb database ${conn.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`Error in MongoDB: ${error}`, bgRed.white)
    }
};
export default connectDB;