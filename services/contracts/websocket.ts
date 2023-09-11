
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';

const CONTRACTS_WEBSOCKET_URL = 'wss://hls.pow.co/websockets/contracts';

export function useContractsWebSocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const hook = useWebSocket(CONTRACTS_WEBSOCKET_URL, {
        onOpen: async () => {
            console.log('ws.contracts.onOpen');
        },
        onMessage: async (message) => {
            console.log('ws.contracts.onMessage', message);        
        },
        onClose: async () => {
            console.log('ws.contracts.onClose');
        },
      });

    if (!socket && hook.getWebSocket()) {
        setSocket(hook.getWebSocket() as WebSocket);
    }

    function subscribeContract({ origin }: { origin: string }) {
        if (socket) {
            (socket as WebSocket).send(JSON.stringify({
                method: 'contract.subscribe',
                params: { origin },
            }));
        }
    }


    function unsubscribeContract({ origin }: { origin: string }) {
        if (socket) {
            (socket as WebSocket).send(JSON.stringify({
                method: 'contract.subscribe',
                params: { origin },
            }));
        }
    }

    return {
        hook,
        socket,
        subscribeContract,
        unsubscribeContract,
    };

}
