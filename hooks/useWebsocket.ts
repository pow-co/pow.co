
import io from 'socket.io-client';

import { useEffect, useState } from 'react';

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