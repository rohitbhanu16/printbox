import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

export const subscribeToOrderUpdates = (userId, callback) => {
  socket.emit('join', {userId});
  socket.on('orderUpdated', (data)=> {
    if(data.userId === userId) {
      callback(data);
    }
  });
};

export const unsubscribeFromOrderUpdates = (userId) => {
  socket.emit('leave', {userId});
};

export default socket;