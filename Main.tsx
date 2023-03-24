import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import { View, Dimensions, StatusBar as NativeStatusBar } from 'react-native';
import config from './config';
import AddFeedInput from './src/component/addFeedInput';
import TitleBar from './src/component/titleBar';
import FeedsView from './src/component/feedsView';
import { MenuContext } from './src/context/menuContext';
import { Button } from '@react-native-material/core';
import tw from 'twrnc';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FeedsContext } from './src/context/feedsContext';
import Swipe, { Directions, Distance } from './src/component/swipe';

export default (): JSX.Element => {
  const { toggleMenu, setMenuStyle } = useContext(MenuContext);
  const { feeds, setFeeds } = useContext(FeedsContext);

  let { height } = Dimensions.get("window");
  height += NativeStatusBar.currentHeight;
  
  useEffect(() => {
    setMenuStyle({
      ...tw`bg-purple-700`,
      top: NativeStatusBar.currentHeight + 10,
    })
  }, []);

  return (
    <Swipe
      direction={Directions.Right}
      distance={Distance.Short}
      onSwipe={toggleMenu}>
      <View className='fontSans' style={{height}}>
        <StatusBar style="auto" />
        <TitleBar label={config.appTitle} />
        <Button
          title="Open Settings"
          onPress={toggleMenu}
          variant="outlined"
          leading={props => <Icon name="menu-open" {...props} />}
          />
        <AddFeedInput setFeeds={setFeeds} />
        <FeedsView feeds={feeds} />
      </View>
    </Swipe>
  );
}