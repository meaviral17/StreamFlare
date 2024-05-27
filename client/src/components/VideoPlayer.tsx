import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{stream: MediaStream}>= ({stream}) =>{
    const videoRef= useRef<HTMLVideoElement>(null);
    useEffect(()=>{
        if(videoRef.current) {
            videoRef.current.srcObject= stream; //set the video source to the stream
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
            };
        }
    }, [stream])
    return (
        <video ref={videoRef} autoPlay muted={true}></video>
    );
}