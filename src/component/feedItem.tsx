import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Linking, Text, View } from "react-native";
import { RSSItem } from "../data_struct";
import tw from 'twrnc';
import { ConfigContext } from "../context/configContext";
import { cleanString } from "../service/string";
import Ionicons from '@expo/vector-icons/Ionicons';
import appConfig, { ChannelTitleMode } from "../../appConfig";
import config, { Config } from "../service/config";
import style from "../style/style";
import { normalizePubDate } from "../service/date";

type Props = {
    item: RSSItem;
    it: number;
}

const getDateText = (pubDate: string): string => {
    pubDate = normalizePubDate(pubDate)
    const d = new Date(pubDate);

    if (!(+d)) {
        return ""
    }
    return "~"+d.toLocaleDateString();
} 

const FeedItem = ({ it, item }: Props): JSX.Element => {
    const isOpened = useRef(false);
    const { onConfigChange } = useContext(ConfigContext);
    const slideValue = new Animated.Value(0);
    const [channelDisplay, setChannelDisplay] = useState<ChannelTitleMode>(config.props.displayChannelTitle);
    const descH = useRef(0);
    const formatedPubDate = getDateText(item.pubDate);

    useEffect(() => {
        const [leaveEventConfig] = onConfigChange((config: Config) => {
            setChannelDisplay(config.props.displayChannelTitle);
        });
        return () => {
            leaveEventConfig();
        }
    }, []);

    const animate = () => {
        Keyboard.dismiss();
        if (!isOpened.current) {
            slideValue.setValue(0);
            toValue = appConfig.maxHeightFeedDescAnimation;
        } else {
            slideValue.setValue(descH.current);
            toValue = 0;
        }
        Animated.timing(slideValue, {
            toValue,
            duration: descH.current / appConfig.maxHeightFeedDescAnimation * appConfig.openSpeedDescAnimation,
            useNativeDriver: false,
        }).start();
        isOpened.current = !isOpened.current;
    };

    const openMegaphoneLink = () => {
        if (isOpened.current) {
            Linking.openURL(item.link);
        }
    };

    const preTagChar = channelDisplay === ChannelTitleMode.Inline ? " " : "\n";
    let toValue = appConfig.maxHeightFeedDescAnimation;

    return (
        <View style={{
            ...tw`pb-0.5`,
            backgroundColor: it % 2 === 1 ? style.beige : "",
        }}>
            <Text
                style={tw`font-medium text-base px-1 pt-0.5 pb-0 m-0`}
                onPress={animate}
            >
                {cleanString(item.title)}
                {item.channelTitle &&
                    <Text style={tw`text-neutral-400 text-sm m-0 p-0`}>{preTagChar}@{item.channelTitle} {formatedPubDate} </Text>
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
                    onLayout={e => descH.current = e.nativeEvent.layout.height}
                    onPress={openMegaphoneLink}>
                    <Ionicons name="megaphone" /> {cleanString(item.description)}
                </Text>
            </Animated.View>
        </View>
    )
}

export default FeedItem;