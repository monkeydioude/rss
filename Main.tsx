import { StatusBar } from 'expo-status-bar';
import React, { useContext, useRef } from 'react';
import { View, Dimensions, StatusBar as NativeStatusBar, ScrollView } from 'react-native';
import defaultConfig from './defaultConfig';
import TitleBar from './src/component/titleBar';
import FeedsView from './src/component/feedsView';
import { Button } from '@react-native-material/core';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FeedsContext } from './src/context/feedsContext';
import SideMenu from './src/component/sideMenu/sideMenu';
import FeedItemsFilters from './src/component/feedItemsFilters';


export default (): JSX.Element => {
    const { feeds } = useContext(FeedsContext);
    const scroll = useRef<ScrollView>(null);

    let { height, width } = Dimensions.get("window");
    height += NativeStatusBar.currentHeight;
    
    return (
        <View
            className='fontSans'
            style={{ height }}
            // onTouchStart={() => Keyboard.dismiss()}
            >
            <StatusBar style="auto" />
            <TitleBar label={defaultConfig.appTitle} />
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
                    <FeedItemsFilters />
                    <FeedsView feeds={feeds} />
                </View>
            </ScrollView>
        </View>
    );
}