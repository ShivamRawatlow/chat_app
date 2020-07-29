import React, { useContext } from 'react';
import { IChat } from '../interfaces/i_chat';
import MyContext from '../contexts/my_context';

const ChatBox = ({ chat }: { chat: IChat }) => {
  const context = useContext(MyContext);

  const userName = chat.userName;
  const time = chat.time;

  let messageBody: string | JSX.Element = '';

  if (chat.islocation) {
    const pre = "Here's my location : ";
    messageBody = (
      <a href={chat.messageBody} style={{ color: 'white' }}>
        <h6>myLocation</h6>
      </a>
    );
  } else {
    messageBody = chat.messageBody;
  }

  const isYou = chat.userName === context?.user?.userName;

  const you = (
    <div style={{ textAlign: 'end', margin: '.5rem' }}>
      <h6>You</h6>
      <div
        className='card-panel chat-box1 green'
        style={{
          display: 'inline-flex',
          borderRadius: '15px',
          maxWidth: '50%',
          padding: '.4rem',
          margin: '0',
        }}
      >
        <span>{messageBody}</span>
      </div>
      <p style={{ margin: '0' }}>{time}</p>
    </div>
  );

  const other = (
    <div style={{ margin: '1rem' }}>
      <h6 style={{ margin: '0' }}>{userName}</h6>
      <div
        className='card-panel chat-box1'
        style={{
          display: 'inline-flex',
          borderRadius: '15px',
          maxWidth: '50%',
          margin: '.5rem',
          padding: '.5rem',
        }}
      >
        <span>{messageBody}</span>
      </div>
      <p style={{ margin: '0' }}>{time}</p>
    </div>
  );

  return isYou ? <>{you}</> : <>{other}</>;
};

export default ChatBox;
