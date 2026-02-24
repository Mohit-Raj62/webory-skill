import { connectDB, mongoose } from './config/mongodb.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connection test successful!');
    
    // Close the connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during database connection test:', error);
    process.exit(1);
  }
}

testConnection();
