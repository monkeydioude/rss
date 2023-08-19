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
import { normalizeItemCategory } from "../service/item_ops";
import { handleHighlights } from "../text_op";

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
    return "~" + d.toLocaleDateString();
}

const FeedItem = ({ it, item }: Props): JSX.Element => {
    const isOpened = useRef(false);
    const { onConfigChange } = useContext(ConfigContext);
    const slideValue = new Animated.Value(0);
    const [channelDisplay, setChannelDisplay] = useState<ChannelTitleMode>(config.props.displayChannelTitle);
    const [displayCategories, setDisplayCategories] = useState<boolean>(config.props.displayCategories);
    const descH = useRef(0);
    const formatedPubDate = getDateText(item.pubDate);

    useEffect(() => {
        const [leaveEventConfig] = onConfigChange((config: Config) => {
            setChannelDisplay(config.props.displayChannelTitle);
            setDisplayCategories(config.props.displayCategories);
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
    const categories = displayCategories ? normalizeItemCategory(item.category) : "";

    return (
        <View style={{
            ...tw`pb-0.5 pt-1`,
            backgroundColor: it % 2 === 1 ? style.beige : "",
        }}>
            <Text
                style={tw`font-normal text-base px-1 pt-0.5 pb-0 m-0 flex flex-wrap text-lg`}
                onPress={animate}
            >
                {handleHighlights(cleanString(item.title))}
                
                {item.channelTitle  &&
                    <Text style={tw`text-neutral-500 text-sm m-0 p-0 mx-1`}>{preTagChar}@{item.channelTitle} {formatedPubDate}</Text>
                }
            </Text>
            <Animated.View
                style={{
                    maxHeight: slideValue,
                    margin: 0,
                    padding: 0,
                }}>
                <Text
                    style={{
                        ...tw`font-medium text-base m-0 p-0 px-1 underline text-lg`,
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                    }}
                    onLayout={e => descH.current = e.nativeEvent.layout.height}
                    onPress={openMegaphoneLink}>
                    <Ionicons name="megaphone" /> {handleHighlights(cleanString(item.description))}
                </Text>
            </Animated.View>
            {categories !== "" &&
                <Text style={tw`font-normal text-purple-600 m-0 px-1`}>
                    #{categories}
                </Text>
            }
        </View>
    )
}

export default FeedItem;