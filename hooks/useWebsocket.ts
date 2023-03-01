
import io from 'socket.io-client';

import { useEffect, useRef, useState } from 'react';

const tokenMeetLiveSocket = io('wss://tokenmeet.live', {
  transports: ['websocket']
});

const powcoSocket = io('wss://pow.co', {
  transports: ['websocket']
});

export function useTokenMeetLiveWebsocket() {

    const [isConnected, setIsConnected] = useState(tokenMeetLiveSocket.connected);
    const [lastPong, setLastPong] = useState<any>(null);

  useEffect(() => {
    tokenMeetLiveSocket.on('connect', () => {
      console.log('websocket___connected')
      setIsConnected(true);
    });

    tokenMeetLiveSocket.on('disconnect', () => {
      console.log('websocket___disconnected')
      setIsConnected(false);
    });

    tokenMeetLiveSocket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      tokenMeetLiveSocket.off('connect');
      tokenMeetLiveSocket.off('disconnect');
      tokenMeetLiveSocket.off('pong');
    };
  }, []);

  const sendPing = () => {
    tokenMeetLiveSocket.emit('ping');
  }

    return {
        isConnected,
        socket: tokenMeetLiveSocket
    }

}

export function usePowcoWebsocket() {

  const [isConnected, setIsConnected] = useState(powcoSocket.connected);
  const [lastPong, setLastPong] = useState<any>(null);

useEffect(() => {
  powcoSocket.on('connect', () => {
    console.log('websocket___connected')
    setIsConnected(true);
  });

  powcoSocket.on('disconnect', () => {
    console.log('websocket___disconnected')
    setIsConnected(false);
  });

  powcoSocket.on('pong', () => {
    setLastPong(new Date().toISOString());
  });

  powcoSocket.on('message', (data: any) => {
    console.log('powco.socket.message', data)
  })

  powcoSocket.on('*', (data: any) => {
    console.log('powco.socket.*', data)
  })

  powcoSocket.on('boostpow.job.created', (data: any) => {

    console.log('powco.socket.boostpow.job.created', data)

  })

  powcoSocket.on('boostpow.proof.created', (data: any) => {

    console.log('powco.socket.boostpow.proof.created', data)
    
  })

  return () => {
    powcoSocket.off('connect');
    powcoSocket.off('disconnect');
    powcoSocket.off('pong');
    powcoSocket.off('boostpow.job.created');
    powcoSocket.off('boostpow.proof.created');
  };
}, []);

const sendPing = () => {
  powcoSocket.emit('ping');
}

  return {
      isConnected,
      socket: powcoSocket
  }

}

export const useBMAPSocket = (url:string) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // create a new WebSocket connection
    socketRef.current = new WebSocket(`https://b.map.sv/s/${url}`);

    // add event listeners for the WebSocket connection
    socketRef.current.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    socketRef.current.addEventListener("message", (event: any) => {
      const message = JSON.parse(event.data);
      console.log("New message:", message);
      // update state to display the new message
    });

    socketRef.current.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    return () => {
      // close the WebSocket connection when the component unmounts
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (message: any) => {
    // send a message to the WebSocket server
    socketRef.current?.send(JSON.stringify(message));
  };

  return { sendMessage }
}