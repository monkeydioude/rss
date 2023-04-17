import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Linking, Text, View } from "react-native";
import { RSSItem } from "../data_struct";
import tw from 'twrnc';
import { ConfigContext } from "../context/configContext";
import { cleanString } from "../service/string";
import Ionicons from '@expo/vector-icons/Ionicons';
import defaultConfig, { ChannelTitleMode } from "../../defaultConfig";
import config, { Config } from "../service/config";

type Props = {
    item: RSSItem;
    it: number;
}

const FeedItem = ({ it, item }: Props): JSX.Element => {
    const isOpened = useRef(false);
    const { onConfigChange } = useContext(ConfigContext);
    const slideValue = new Animated.Value(0);
    const [channelDisplay, setChannelDisplay] = useState<ChannelTitleMode>(config.props.displayChannelTitle);
    const descH = useRef(0);

    useEffect(() => {
        const [leaveEventConfig] = onConfigChange((config: Config) => {
            setChannelDisplay(config.props.displayChannelTitle);
        });
        return () => {
            leaveEventConfig();
        }
    }, []);


    const preTagChar = channelDisplay === ChannelTitleMode.Inline ? " " : "\n";
    let toValue = defaultConfig.maxHeightFeedDescAnimation;

    return (
        <View style={{
            ...tw`pb-0.5`,
            backgroundColor: it % 2 === 1 ? "rgba(255, 200, 94, 0.15)" : "",
        }}>
            <Text
                style={tw`font-medium text-base px-1 pt-0.5 pb-0 m-0`}
                onPress={() => {
                    if (!isOpened.current) {
                        slideValue.setValue(0);
                        toValue = defaultConfig.maxHeightFeedDescAnimation;
                    } else {
                        slideValue.setValue(descH.current);
                        toValue = 0;
                    }
                    Animated.timing(slideValue, {
                        toValue,
                        duration: descH.current / defaultConfig.maxHeightFeedDescAnimation * defaultConfig.openSpeedDescAnimation,
                        useNativeDriver: false,
                    }).start();
                    isOpened.current = !isOpened.current;
                }}>{cleanString(item.title)}
                {item.channelTitle &&
                    <Text style={tw`text-neutral-400 text-sm m-0 p-0`}>{preTagChar}@{item.channelTitle}</Text>
                }
            </Text>
            <Animated.View
                style={{
                    maxHeight: slideValue,
                    margin: 0,
                    padding: 0,
                }}>
                <Text
                    style={tw`font-medium text-base m-0 p-0 underline`}
                    onLayout={e => {
                        descH.current = e.nativeEvent.layout.height; 
                    }}
                    onPress={() => {
                        if (isOpened.current) {
                            Linking.openURL(item.link);
                        }
                    }}>
                    <Ionicons name="megaphone" /> {cleanString(item.description)}
                </Text>
            </Animated.View>
        </View>
    )
}

export default FeedItem;