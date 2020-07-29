import React, { useEffect, useContext, useState } from 'react';
import M from 'materialize-css';
import MyContext from '../contexts/my_context';
import { User } from '../interfaces/User';
import ChatPage from '../pages/chat_page';

const NavDrawer = () => {
  const context = useContext(MyContext);
  const roomName = context?.user?.roomName;
  const allUsers = context!.allUsers;

  useEffect(() => {
    const sidenav = document.querySelector('#slide-out');
    M.Sidenav.init(sidenav!, {});
  }, []);

  return (
    <>
      <div
        id='slide-out'
        className='container sidenav sidenav-fixed '
        style={{ overflow: 'hidden' }}
      >
        <div
          className='row dark-background center'
          style={{ height: '20vh', margin: 0 }}
        >
          <h2 className='col s12'>{roomName}</h2>
        </div>
        <div className=' row light-background' style={{ minHeight: '80vh' }}>
          <ul className=' col s12' style={{ padding: '1rem' }}>
            {allUsers.map((user) => (
              <li key={user.id}>{user.userName}</li>
            ))}
          </ul>
        </div>
      </div>
      <a href='#' data-target='slide-out' className='sidenav-trigger'>
        <i
          className='material-icons'
          style={{ padding: '.5rem', position: 'fixed' }}
        >
          menu
        </i>
      </a>
    </>
  );
};

export default NavDrawer;
