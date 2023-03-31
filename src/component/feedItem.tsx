import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Linking, Text, View } from "react-native";
import { RSSItem } from "../data_struct";
import tw from 'twrnc';
import { ConfigContext, ChannelTitleMode, Config } from "../context/configContext";
import { EventsContext } from "../context/eventsContext";
import config from "../../config";

type Props = {
    item: RSSItem;
    it: number;
}

const FeedItem = ({ item, it: key }: Props): JSX.Element => {
    const isOpened = useRef(false);
    const { getConfig, onConfigChange } = useContext(ConfigContext);
    const { trigger, onEvent } = useContext(EventsContext);
    const slideValue = new Animated.Value(-20);
    const [ channelDisplay, setChannelDisplay ] = useState<ChannelTitleMode>(
        getConfig("displayChannelTitle")
    );

    useEffect(() => {
        const [ leaveEventConfig ] = onConfigChange((config: Config) => {
            setChannelDisplay(config.displayChannelTitle);
        });

        const [ leaveEventDesc ] = onEvent(
            config.events.feed_desc_open,
            (k: number) => {
                if (k === key) {
                    return;
                }
                slideValue.setValue(100);
                toValue = -20;
                Animated.timing(slideValue, {
                    toValue,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
        })
        return () => {
            leaveEventConfig();
            leaveEventDesc();
        }
    }, []);

    const preTagChar = channelDisplay === ChannelTitleMode.Inline ? " " : "\n";
    let toValue = 138;

    return (
        <View style={tw`pb-0.5`}>
            <Text
                    style={tw`font-medium text-base px-1 pb-0 m-0`}
                    onPress={() => {
                        if (!isOpened.current) {
                            slideValue.setValue(-20);
                            toValue = 130;
                        } else {
                            trigger(config.events.feed_desc_open, key);
                            slideValue.setValue(100);
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
                    <Text style={tw`text-neutral-400 text-sm m-0 p-0`}>{preTagChar}@{item.channelTitle}</Text>
                }
            </Text>
            <Animated.View
                style={{
                    maxHeight: slideValue,
                }}>
                <Text
                    style={tw`font-medium text-base m-0.5 p-0 underline`}
                    onPress={() => {
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