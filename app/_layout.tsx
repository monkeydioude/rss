import React, { useEffect, useState } from 'react';
// import FeedsProvider from 'src/context/feedsContext';
import EventsProvider from 'src/context/eventsContext';
import ConfigProvider from 'src/context/configContext';
import { Stack } from "expo-router/stack";
import TitleBar from 'src/component/titleBar'
import appConfig from 'src/appConfig';
import { StatusBar } from 'expo-status-bar';
import FeedProvider from 'src/store/feed';
import ChannelsProvider from 'src/store/channels';
import { Storage } from 'src/service/data_storage';

const RootNavigator = () => {
  return (
    <Stack
      screenOptions={{
        header: () => (<TitleBar label={appConfig.appTitle} />)
      }}
      >
      <Stack.Screen name="(app)" />  
    </Stack>
  )
}

const App = (): JSX.Element => {
  return (
    <FeedProvider>
      <ChannelsProvider>
        <EventsProvider>
          <ConfigProvider>
            {/* <FeedsProvider> */}
              <>
              <StatusBar style="light" />
              <RootNavigator />
              </>
            {/* </FeedsProvider> */}
          </ConfigProvider>
        </EventsProvider>
      </ChannelsProvider>
    </FeedProvider>
  )
}

export default App;