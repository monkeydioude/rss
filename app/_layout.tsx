import React from 'react';
import Main from 'src/Main';
import FeedsProvider from 'src/context/feedsContext';
import EventsProvider from 'src/context/eventsContext';
import ConfigProvider from 'src/context/configContext';
import { Stack } from "expo-router/stack";
import TitleBar from 'src/component/titleBar'
import appConfig from 'src/appConfig';
import { StatusBar } from 'expo-status-bar';

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
    <EventsProvider>
      <ConfigProvider>
        <FeedsProvider>
          <>
          <StatusBar style="light" />
          <RootNavigator />
          </>
        </FeedsProvider>
      </ConfigProvider>
    </EventsProvider>
  )
}

export default App;