import React from 'react';
import SideMenu from './src/component/sideMenu';
import MenuProvider from './src/context/menuContext';
import Main from './Main';
import config from './config';
import FeedsProvider from './src/context/feedsContext';
import EventsProvider from './src/context/eventsContext';

export default (): JSX.Element => (
  <EventsProvider>
    <FeedsProvider>
      <MenuProvider
        MenuComponent={SideMenu}
        animation={{
          type: "slide",
          duration: config.settingsMenuAnimationDuration
        }}>
        <Main />
      </MenuProvider>
    </FeedsProvider>
  </EventsProvider>
)