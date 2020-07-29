import { createContext } from 'react';
import { IUser } from '../interfaces/i_user';
import { User } from '../interfaces/User';
import { IChat } from '../interfaces/i_chat';

interface MyContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  allUsers: User[];
  socket: SocketIOClient.Socket;
  allChats: IChat[];
}

const MyContext = createContext<MyContext | null>(null);

export default MyContext;
