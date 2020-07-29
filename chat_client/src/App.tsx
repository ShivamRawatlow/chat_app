import React, { useState, useEffect } from 'react';
import { IUser } from './interfaces/i_user';
import { BrowserRouter } from 'react-router-dom';
import MyContext from './contexts/my_context';
import Routing from './components/routing';
import { User } from './interfaces/User';
import { IChat } from './interfaces/i_chat';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

const ENDPOINT = 'localhost:5000';
let socket: SocketIOClient.Socket = io(ENDPOINT);

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [roomName, setRoomName] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allChats, setAllChats] = useState<IChat[]>([]);

  useEffect(() => {
    checkUsers();
    checkMessage();
    checkLocation();
  }, [ENDPOINT]);

  const checkUsers = () => {
    socket.on(
      'roomData',
      ({ room, users }: { room: string; users: User[] }) => {
        console.log('users', users);
        console.log('room', room);
        setAllUsers(users);
        setRoomName(room);
      }
    );
  };

  const checkMessage = () => {
    socket.on('message', (message: any) => {
      const newChat: IChat = {
        userName: message.userName,
        messageBody: message.messageBody,
        time: moment(message.createdAt).format('h:mm a'),
        islocation: false,
        id: uuidv4(),
      };

      setAllChats((allChats) => [...allChats, newChat]);
    });
  };

  const checkLocation = () => {
    socket.on('locationMessage', (message: any) => {
      const newChat: IChat = {
        userName: message.userName,
        messageBody: message.messageBody,
        islocation: true,
        time: moment(message.createdAt).format('h:mm a'),
        id: uuidv4(),
      };

      setAllChats((allChats) => [...allChats, newChat]);
    });
  };

  return (
    <MyContext.Provider
      value={{
        user,
        setUser,
        allUsers,
        socket,
        allChats,
      }}
    >
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </MyContext.Provider>
  );
}

export default App;
