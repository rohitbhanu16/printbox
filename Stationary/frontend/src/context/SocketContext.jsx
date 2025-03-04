import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5001'); // Connect to backend
    setSocket(newSocket);

    newSocket.on('newOrder', (order) => {
      console.log('New order received:', order);
      setNewOrder(order);
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, newOrder, setNewOrder }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
