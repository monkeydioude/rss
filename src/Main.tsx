import React, { useContext, useRef } from 'react';
import { View, Dimensions, StatusBar as NativeStatusBar, ScrollView, Text } from 'react-native';
import FeedsView from 'src/component/feedsView';
import { Button } from '@react-native-material/core';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FeedsContext } from 'src/context/feedsContext';
import SideMenu from 'src/component/sideMenu/sideMenu';
import FeedItemsFilters from 'src/component/feedItemsFilters';
import tw from 'twrnc';
import useBoot from './hooks/useBoot';
import Cookie from './component/loading/cookie';

const Main = (): JSX.Element => {
    const bootDone = useBoot();
    // const { feeds } = useContext(FeedsContext);
    const scroll = useRef<ScrollView>(null);

    let { height, width } = Dimensions.get("window");
    height += NativeStatusBar.currentHeight || 0;
    
    return (
        <View
            style={{
                height,
            }}
            // onTouchStart={() => Keyboard.dismiss()}
            >
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
                    <SideMenu closeMenu={() => scroll.current?.scrollToEnd()} />
                </View>
                <View style={{
                    width,
                }}>
                    <Button
                        titleStyle={tw`text-lg`}
                        title="Open Settings"
                        onPress={() => scroll.current?.scrollTo({x: 0})}
                        variant="outlined"
                        leading={props => <Icon name="menu-open" {...props} />}
                        />
                    <FeedItemsFilters />
                    {bootDone ? 
                        <FeedsView/> :
                        <Cookie />
                    }
                </View>
            </ScrollView>
        </View>
    );
}

export default Main;