import mongoose from 'mongoose'
import Colors from 'colors'
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Conneted To Mongodb Database ${conn.connection.host}`.bgMagenta.white
        );
    } catch (error) {
        console.log(`Error in Mongodb ${error}`.ColorRed.white);
    }
}

export default connectDB;