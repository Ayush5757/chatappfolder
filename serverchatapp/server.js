import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
export const userSocketMap = {}

export const io = new Server(server, {
  cors: {origin: '*'}
})

io.on('connection', (socket)=>{
  const userId = socket.handshake.query.userId;
  if(userId) userSocketMap[userId] = socket.id;
  io.emit('getOnlineUsers', Object.keys(userSocketMap))
  socket.on('disconnect', ()=>{
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})
app.use('/jack',(req,res)=>{
  res.send('jack is a good boy')
})
app.use(express.json({ limit: "4mb" }));
app.use(cors());
await connectDB();   
app.use('/api/auth', userRouter);
app.use('/api/messages',messageRouter);
app.use("/api/status", (req, res) => {
  res.send("request successfull");
});



server.listen(5000, () => {
});
