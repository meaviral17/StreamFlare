import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";
import { roomHandler } from "./room";

const port=8080;
const app = express();
app.use(cors);
const server= http.createServer(app);
const io= new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }

});

io.on("connection", (socket)=>{
    console.log("User connected")
    roomHandler(socket);
    socket.on("disconnect", ()=>{
        console.log("User disconnected");
    });
})

server.listen(port, ()=> {
    console.log(`Server is running on port number ${port}`);
})