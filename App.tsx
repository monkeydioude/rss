import React from 'react';
import Main from './Main';
import FeedsProvider from './src/context/feedsContext';
import EventsProvider from './src/context/eventsContext';
import ConfigProvider from './src/context/configContext';
import Boot from './src/component/boot/boot';

export default (): JSX.Element => (
  <EventsProvider>
    <ConfigProvider>
      <FeedsProvider>
        <Boot>
          <Main />
        </Boot>
      </FeedsProvider>
    </ConfigProvider>
  </EventsProvider>
)