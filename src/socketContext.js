import React, { createContext, useState, useRef, useEffect } from "react";
import {io} from 'socket.io-client'
import Peer from 'simple-peer';

const SocketContext = createContext();

// URL of deployed server here
// const socket = io('http://localhost:5000');
const socket = io('https://videocallsom1-server.herokuapp.com/');




const ContextProvider = ({ children }) => {
    
    let myVideo = useRef()
    let userVideo = useRef()
    let connectionRef = useRef()
    
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState('')

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            })

        socket.on('me', (id) => { setMe(id) })

        socket.on('calluser', ({ signal, from, name: CallerName }) => {
            setCall({ isReceivedCall: true, from, name: CallerName, signal })
        })

    },[])

  
    const callUser = (id) => {
        // Initiator:true bcoz we are initiating the call
        const peer = new Peer({ initiator: true, trickle: false, stream })

        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name })
        })

        peer.on('stream', (currentstream) => {
            userVideo.current.srcObject = currentstream
        })

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);
            console.log("Call Accepted",signal)
            peer.signal(signal)
        })
        connectionRef.current = peer
    }
    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream })
        
        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from })
        })

        peer.on('stream', (currentstream) => {
            userVideo.current.srcObject = currentstream
        })

        peer.signal(call.signal)

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true)

        connectionRef.current.destroy()
        // to provide the user a new id - workaround
        window.location.reload()
    }

    return <SocketContext.Provider value={
       { 
        myVideo,
        userVideo,
        connectionRef,
        stream,setStream,
        me,setMe,
        call,setCall,
        callAccepted, setCallAccepted,
        callEnded, setCallEnded,
        name, setName,
        answerCall,
        callUser,
        leaveCall}
    }>
        {children}
    </SocketContext.Provider >;
};

export {ContextProvider,SocketContext}