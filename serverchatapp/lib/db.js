import mongoose from "mongoose";

async function connectDB() {
  try {
    mongoose.connection.on('connected',()=>console.log('Database connected'));
    await mongoose.connect(process.env.MONGODB_URI + '/chat-app')
  } catch (err) {
  }
}

export default connectDB