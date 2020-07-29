export class User {
  id: string;
  userName: string;
  roomName: string;

  constructor(id: string, userName: string, roomName: string) {
    this.id = id;
    this.userName = userName;
    this.roomName = roomName;
  }
}
