import React from 'react';
import SideMenu from './src/component/sideMenu';
import MenuProvider from './src/context/menuContext';
import Main from './Main';
import config from './config';
import FeedsProvider from './src/context/feedsContext';
import EventsProvider from './src/context/eventsContext';
import ConfigProvider from './src/context/configContext';

export default (): JSX.Element => (
  <EventsProvider>
    <ConfigProvider>
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
    </ConfigProvider>
  </EventsProvider>
)