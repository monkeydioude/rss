import React from 'react';
import Main from 'src/Main';
import FeedsProvider from 'src/context/feedsContext';
import EventsProvider from 'src/context/eventsContext';
import ConfigProvider from 'src/context/configContext';

const App = (): JSX.Element => {

  return (
    <EventsProvider>
      <ConfigProvider>
        <FeedsProvider>
            <Main />
        </FeedsProvider>
      </ConfigProvider>
    </EventsProvider>
  )
}

export default App;