import React, { useContext, useRef, useState } from "react";
import { Animated, Linking, Text, View } from "react-native";
import { RSSItem } from "../data_struct";
import tw from 'twrnc';
import { ConfigContext, ConfigKeys, ChannelTitleMode } from "../context/configContext";

type Props = {
    item: RSSItem;
}

const FeedItem = ({ item }: Props): JSX.Element => {
    const isOpened = useRef(false);
    const { getConfig, onConfigChange } = useContext(ConfigContext);
    const slideValue = new Animated.Value(-20);
    const [ channelDisplay, setChannelDisplay ] = useState<ChannelTitleMode>(ChannelTitleMode.NewLine);

    onConfigChange(
        ConfigKeys.DisplayChannelTitle,
        () => setChannelDisplay(getConfig(ConfigKeys.DisplayChannelTitle))
    );
    const preTagChar = channelDisplay === ChannelTitleMode.Inline ? " " : "\n";
    let toValue = 130;

    return (
        <View style={tw`pb-1`}>
            <Text
                    style={tw`font-medium text-base px-1 pb-0`}
                    onPress={() => {
                        console.log(item);
                        if (!isOpened.current) {
                            slideValue.setValue(-20);
                            toValue = 130;
                        } else {
                            slideValue.setValue(130);
                            toValue = -20;
                        }
                        Animated.timing(slideValue, {
                            toValue,
                            duration: 200,
                            useNativeDriver: false,
                        }).start();
                        isOpened.current = !isOpened.current;
                    }}>{item.title}
                {item.channelTitle && 
                    <Text style={tw`text-neutral-400 text-sm`}>{preTagChar}@{item.channelTitle}</Text>
                }
            </Text>
            <Animated.View
                style={{
                    maxHeight: slideValue,
                }}>
                <Text
                    style={tw`font-medium text-base m-1 p-0 underline`}
                    onPress={() => {
                        console.log(item.link, isOpened.current)
                        if (isOpened.current) {
                            Linking.openURL(item.link);
                        }
                    }}>
                    {item.description.trim()}</Text>
            </Animated.View>
        </View>
    )
}

export default FeedItem;