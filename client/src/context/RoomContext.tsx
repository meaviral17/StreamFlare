import { createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
const WS = 'http://localhost:8080'

export const RoomContext= createContext<null | any>(null);
const ws= socketIOClient(WS);

export const RoomProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const navigate=useNavigate();
    const enterRoom = (roomID: string) => {
        console.log(roomID);
        navigate(`/room/${roomID}`);
    }
    useEffect(()=>{
        ws.on("room created", enterRoom);
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, []);
    return(
        <RoomContext.Provider value={{ws}}>
        {children}
    </RoomContext.Provider>
    );
};