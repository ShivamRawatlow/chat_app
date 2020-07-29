import React, { useState, useContext, useEffect } from 'react';
import MyContext from '../contexts/my_context';
import { useHistory } from 'react-router-dom';
import NavBar from '../components/nav_bar';

const Join = () => {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const context = useContext(MyContext);
  const history = useHistory();
  const socket = context!.socket;

  const onSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    socket.emit('join', { userName, roomName }, (error: Error) => {
      if (error) {
        alert(error);
        setUserName('');
        setRoomName('');
      } else {
        const me = {
          userName,
          roomName,
        };
        context?.setUser(me);
        history.push('/chatpage');
      }
    });
  };

  return (
    <>
      <NavBar />
      <div className='container' style={{ marginTop: '60px' }}>
        <div className='row'>
          <div className='col m3'></div>
          <form
            className='col s12 m6 z-depth-1'
            style={{ padding: '20px' }}
            onSubmit={onSubmit}
          >
            <div className='input-field col s12'>
              <h1>Join Chat</h1>
              <input
                placeholder='User Name'
                id='first_name'
                type='text'
                className='validate'
                autoComplete='off'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className='input-field col s12'>
              <input
                placeholder='Room Name'
                id='last_name'
                type='text'
                className='validate'
                autoComplete='off'
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <button
              className='waves-effect waves-light btn'
              type='submit'
              style={{ marginLeft: '1rem' }}
            >
              Submit
            </button>
          </form>
          <div className='col m3'></div>
        </div>
      </div>
    </>
  );
};

export default Join;
