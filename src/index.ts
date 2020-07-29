import path from 'path';
import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import Filter from 'bad-words';
import { generateMessage, generateLocationMessage } from './utils/messages';
import {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  activeRooms,
} from './utils/users';
import { UserConfirmation } from './enums/UserConfirmation';
import { User } from './models/User';
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = socketio(server);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('chat_client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'chat_client', 'build', 'index.html'));
  });
}

io.on('connection', (socket) => {
  io.emit('activeRooms', activeRooms);

  socket.on('join', ({ userName, roomName }, callback) => {
    const user = new User(
      socket.id,
      userName.trim().toLowerCase(),
      roomName.trim().toLowerCase()
    );
    const userEnum = addUser(user);

    if (userEnum === UserConfirmation.USER_ALREADY_EXISTS) {
      return callback('User Already Exists');
    }
    if (userEnum === UserConfirmation.USER_DATA_NOT_PROVIDED) {
      return callback('User data not provided');
    }

    socket.join(user.roomName);
    socket.emit('message', generateMessage('Admin', 'Welcome'));
    socket.broadcast
      .to(user.roomName)
      .emit(
        'message',
        generateMessage(user.userName, `${user.userName} has joined!`)
      );

    io.to(user.roomName).emit('roomData', {
      room: user.roomName,
      users: getUsersInRoom(user.roomName),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (user == undefined) {
      return callback('User not found');
    }

    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.to(user.roomName).emit(
      'message',
      generateMessage(user.userName, message)
    );
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id);

    if (user == undefined) {
      return callback('User not found');
    }

    io.to(user.roomName).emit(
      'locationMessage',
      generateLocationMessage(
        user.userName,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.roomName).emit(
        'message',
        generateMessage(user.userName, `${user.userName} has left`)
      );
      io.to(user.roomName).emit('roomData', {
        room: user.roomName,
        users: getUsersInRoom(user.roomName),
      });
      io.emit('activeRooms', activeRooms);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
