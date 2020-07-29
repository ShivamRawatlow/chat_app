import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Join from '../pages/join';
import ChatPage from '../pages/chat_page';
import NavDrawer from './nav_drawer';

const Routing = () => {
  return (
    <Switch>
      <Route exact path='/'>
        <Join />
      </Route>
      <Route path='/chatpage'>
        <ChatPage />
      </Route>
    </Switch>
  );
};

export default Routing;
