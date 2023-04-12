import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef } from 'react';
import { View, Dimensions, StatusBar as NativeStatusBar, Keyboard, ScrollView, Text } from 'react-native';
import config from './config';
import AddFeedInput from './src/component/addFeedInput';
import TitleBar from './src/component/titleBar';
import FeedsView from './src/component/feedsView';
import { Button } from '@react-native-material/core';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FeedsContext } from './src/context/feedsContext';
import SideMenu from './src/component/sideMenu/sideMenu';

export default (): JSX.Element => {
    const { feeds, setFeeds } = useContext(FeedsContext);
    const scroll = useRef<ScrollView>(null);

    let { height, width } = Dimensions.get("window");
    height += NativeStatusBar.currentHeight;

    return (
        <View className='fontSans' style={{ height }} onTouchStart={() => Keyboard.dismiss()}>
            <StatusBar style="auto" />
            <TitleBar label={config.appTitle} />
            <ScrollView
                contentOffset={{
                    x: width,
                    y: 0
                }}
                bounces={false}
                pagingEnabled={true}
                ref={scroll}
                horizontal={true}>
                <View style={{
                    width,
                }}>
                    <SideMenu closeMenu={() => scroll.current.scrollToEnd()} />
                </View>
                <View style={{
                    width,
                }}>
                    <Button
                        title="Open Settings"
                        onPress={() => scroll.current.scrollTo({x: 0})}
                        variant="outlined"
                        leading={props => <Icon name="menu-open" {...props} />}
                        />
                    <AddFeedInput setFeeds={setFeeds} />
                    <FeedsView feeds={feeds} />
                </View>
            </ScrollView>
        </View>
    );
}