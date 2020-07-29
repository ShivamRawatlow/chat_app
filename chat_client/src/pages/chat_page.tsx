import React, { useEffect, useState, useContext } from 'react';
import ChatBox from '../components/chat_box';
import NavDrawer from '../components/nav_drawer';
import '../scss_files/chat_page.scss';
import MyContext from '../contexts/my_context';
import { useHistory } from 'react-router-dom';
import { animateScroll } from 'react-scroll';

//import disableBrowserBackButton from 'disable-browser-back-navigation';

const ChatPage = () => {
  const context = useContext(MyContext);
  const history = useHistory();
  const [myChat, setMyChat] = useState('');

  const [locationButtonDisabled, setLocationButtonDisabled] = useState(false);
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);

  useEffect(() => {
    if (!context?.user) {
      history.push('/');
    }

    return () => {
      window.location.reload(false);
    };
  }, []);

  useEffect(() => {
    animateScroll.scrollToBottom();
  }, [context?.allChats]);

  const socket = context!.socket;
  const allChats = context!.allChats;

  const sendMessage = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    setSendButtonDisabled(true);
    socket.emit('sendMessage', myChat, (error: Error) => {
      setMyChat('');
      setSendButtonDisabled(false);
      if (error) {
        return console.log(error);
      }
      console.log('Message delivered!');
    });
  };

  const sendLocation = () => {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }

    setLocationButtonDisabled(true);

    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        'sendLocation',
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        (error: Error) => {
          setLocationButtonDisabled(false);
          if (error) {
            return console.log(error);
          }
          console.log('Locaton Shared');
        }
      );
    });
  };

  return (
    <>
      <NavDrawer />
      <main
        className='container'
        style={{ width: '100%', maxHeight: '100%', marginBottom: '22vh' }}
      >
        <div style={{ overflow: 'hidden' }}>
          {allChats.map((chat) => (
            <ChatBox key={chat.id} chat={chat} />
          ))}
        </div>
      </main>
      <footer
        className='page-footer light-background'
        style={{
          position: 'fixed',
          width: '100%',
          bottom: '0',
        }}
      >
        <div className='container'>
          <div className='row'>
            <input
              className=' col m9 s12 light-background'
              placeholder='type your message'
              id='last_name'
              type='text'
              onChange={(e) => setMyChat(e.target.value)}
              autoComplete='off'
              value={myChat}
            />
            <button
              className='col m1 s5 waves-effect waves-light btn'
              type='submit'
              disabled={sendButtonDisabled}
              style={{ margin: '.5rem' }}
              onClick={sendMessage}
            >
              <i className='material-icons'>send</i>
            </button>
            <button
              className='col m1 s5 waves-effect waves-light btn'
              disabled={locationButtonDisabled}
              style={{ margin: '.5rem' }}
              onClick={sendLocation}
            >
              <i className='material-icons'>gps_fixed</i>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ChatPage;
