import { createContext, useEffect, useState, useReducer} from 'react';
import { useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import {v4 as uuidV4} from "uuid";
import Peer from "peerjs";
import { peersReducer } from './PeerReducer';
import { addPeerAction, removePeerAction } from './PeerActions';


const WS = 'http://localhost:8080'
export const RoomContext= createContext<null | any>(null);
const ws= socketIOClient(WS);


export const RoomProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const navigate=useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] =useState<MediaStream>();
    const[peers, dispatch]= useReducer(peersReducer, {});


    const enterRoom = (roomID: string) => {
        console.log(roomID);
        navigate(`/room/${roomID}`);
    }
    const getUsers =({participants}: {participants: string[]}) => {
        console.log("Participants", participants);
    }

    const removePeer = (peerID: string) => {
        dispatch(removePeerAction(peerID));
    }
    useEffect(()=>{
        const meID = uuidV4();
        const peer = new Peer(meID);
        setMe(peer);

        try{
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then((stream) => {
                setStream(stream);
            });
        } catch (error) {
            console.log(error);
        }


        ws.on("room-created", enterRoom);
        ws.on("get-users", getUsers);
        ws.on("user-disconnected", removePeer);
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, []);

    useEffect(()=>{
        if(!me) return;
        if(!stream) return;
        ws.on("user-joined", ({peerID})=>{
            const call=me.call(peerID, stream);
            call.on("stream",(peerStream)=>{
                dispatch(addPeerAction(peerID, peerStream));
            })
        });
        me.on("call",(call)=>{
            call.answer(stream);
            call.on("stream",(peerStream)=>{
                dispatch(addPeerAction(call.peer, peerStream));
            })
        })
    },[me, stream]);

    console.log({peers});
    return(
        <RoomContext.Provider value={{ws, me, stream, peers}}>
        {children}
    </RoomContext.Provider>
    );
};