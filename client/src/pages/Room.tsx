import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../context/PeerReducer";

export const Room= () => {
    const {id} =useParams();
    const {ws, me, stream, peers} = useContext(RoomContext);
    useEffect(()=>{
        if (me) ws.emit("join-room", {roomID: id, peerID: me._id});
        
    },[id, ws, me]);
    return(<>
        Room ID: {id}
        <div className="grid grid-cols-4 gap-4">
            <VideoPlayer stream={stream}></VideoPlayer>
        {Object.values(peers as PeerState).map((peer) => (
            <VideoPlayer stream={peer.stream}></VideoPlayer>
        ))}
        </div>
    </>);
  };