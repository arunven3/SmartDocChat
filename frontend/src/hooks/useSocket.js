import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';


export function useSocket() {
  let socketInstance;
  const [socket, setSocket] = useState(null);

    useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(process.env.REACT_APP_API_BASE_URL , {
        transports: ['websocket'],
      });
    }

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      };
    }
  }, []);

  return socket;
}

