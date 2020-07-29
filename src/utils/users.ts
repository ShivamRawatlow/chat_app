import { User } from '../models/User';
import { UserConfirmation } from '../enums/UserConfirmation';
import { isUndefined } from 'util';

const users: Array<User> = [];
export const activeRooms: Set<string> = new Set();

export const addUser = (user: User): UserConfirmation => {
  const username = user.userName;
  const room = user.roomName;
  const id = user.id;

  //validate the data
  if (!username || !room) {
    return UserConfirmation.USER_DATA_NOT_PROVIDED;
  }

  //Check for existing user

  const existingUser = users.find((e) => {
    return e.userName === user.userName && e.roomName === user.roomName;
  });

  if (existingUser) {
    return UserConfirmation.USER_ALREADY_EXISTS;
  }

  //Store user
  users.push(user);
  activeRooms.add(user.roomName);

  return UserConfirmation.USER_CREATED;
};

export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    //no user found
    const deletedUser = users.splice(index, 1)[0]; //1 is the number of items we want to remove

    const roomExists = users.find((e) => {
      e.roomName === deletedUser.roomName;
    });

    if (isUndefined(roomExists)) {
      activeRooms.delete(deletedUser.roomName);
    }
    return deletedUser;
  }
};

export const getUser = (id: string): User | undefined => {
  return users.find((e) => e.id === id);
};

export const getUsersInRoom = (roomName: string): Array<User> => {
  roomName = roomName.trim().toLowerCase();
  return users.filter((e) => e.roomName === roomName); //filter returns an array of user
};
