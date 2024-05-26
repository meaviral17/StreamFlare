import { Socket } from "socket.io";
import {v4 as uuidv4} from "uuid";

export const roomHandler = (socket: Socket) => {
    const createRoom=() => {
        const roomID = uuidv4();
        socket.emit('room created',roomID);
        console.log("user created a room");
    }
    const joinRoom =({roomID}:{roomID: string}) => {
        console.log("user joined the room", roomID);
        socket.join(roomID);
    }
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};