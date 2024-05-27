import { Socket } from "socket.io";
import {v4 as uuidv4} from "uuid";

const rooms: Record<string, string[]>={}
interface IRoomParams{
    roomID: string;
    peerID: string;
}
export const roomHandler = (socket: Socket) => {
    const createRoom=() => {
        const roomID = uuidv4();
        rooms[roomID] = [];
        socket.emit('room-created',roomID);
        console.log("user created a room");
    }
    const joinRoom =({roomID, peerID}: IRoomParams) => {
        if(rooms[roomID]){
        console.log("user joined the room", roomID, peerID);
        rooms[roomID].push(peerID);
        socket.join(roomID);

        socket.to(roomID).emit("user-joined",{peerID});
        socket.emit('get-users', {
            roomID,
            participants: rooms[roomID],
        })
        }
        socket.on("disconnect", ()=> {
            console.log("user left the room", peerID);
            leaveRoom({roomID, peerID});
        });
    };
    const leaveRoom= ({peerID, roomID}: IRoomParams)=>{
        rooms[roomID] = rooms[roomID].filter(id => id!==peerID);
        socket.to(roomID).emit("user-disconnected", peerID);
    }
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};