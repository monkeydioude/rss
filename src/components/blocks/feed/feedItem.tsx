import { router } from 'expo-router';
import React, { useCallback, useRef } from "react";
import { Pressable, Text } from "react-native";
import appConfig, { ChannelTitleMode } from "src/appConfig";
import { Item } from "src/entity/item";
import { normalizeItemCategory } from "src/services/normalization/item_ops";
import { cleanString } from "src/services/normalization/string";
import style from "src/style/style";
import { handleHighlights } from "src/text_op";
import tw from 'twrnc';

type Props = {
    item: Item;
    it: number;
    displayChannelTitle: ChannelTitleMode;
    displayCategories: boolean;
    categoriesAmount: number;
}

const getDateText = (pubDate?: number): string => {
    if (!pubDate)
        return "";
    // ghetto
    // if (pubDate * 1000 < +new Date())
    // pubDate *= 1000;
    const d = new Date(pubDate);

    if (!(+d)) {
        return ""
    }
    return `~${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

const FeedItem = ({ it, item, displayChannelTitle, displayCategories, categoriesAmount }: Props): JSX.Element => {
    const isOpened = useRef(false);
    // const slideValue = new Animated.Value(0);
    // const descH = useRef(0);
    const formatedPubDate = getDateText(item.pubDate);

    // const onPressText = useCallback(() => {
    //     Keyboard.dismiss();
    //     if (!isOpened.current) {
    //         slideValue.setValue(0);
    //         toValue = appConfig.maxHeightFeedDescAnimation;
    //     } else {
    //         slideValue.setValue(descH.current);
    //         toValue = 0;
    //     }
    //     Animated.timing(slideValue, {
    //         toValue,
    //         duration: descH.current / appConfig.maxHeightFeedDescAnimation * appConfig.openSpeedDescAnimation,
    //         useNativeDriver: false,
    //     }).start();
    //     isOpened.current = !isOpened.current;
    // }, [isOpened, descH, slideValue]);

    const openMegaphoneLink = useCallback((event: any) => {
        // if (isOpened.current) {
        event.preventDefault();
        router.push({ pathname: "/misc/webview", params: { uri: item.link } });
        // }
    }, [isOpened, item]);

    const preTagChar = displayChannelTitle === ChannelTitleMode.Inline ? "" : "\n";
    let toValue = appConfig.maxHeightFeedDescAnimation;
    const categories = displayCategories ? normalizeItemCategory(item.categories, categoriesAmount) : "";

    return (
        <Pressable
            onPress={openMegaphoneLink}
            style={{
                ...tw`pb-0.5 pt-1`,
                backgroundColor: it % 2 === 1 ? style.beige : "",
            }}>
            <Text
                style={tw`font-normal text-base px-1 pt-0.5 pb-0 m-0 flex flex-wrap text-lg`}
            >
                {handleHighlights(cleanString(item.title || item.description))}

                {(item.channelTitle || item.description) &&
                    <Text style={tw`text-neutral-500 text-sm m-0 p-0 mx-1`}>
                        {preTagChar}@{item.channelTitle || item.description} {formatedPubDate}
                    </Text>
                }
            </Text>
            {/* <Animated.View
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
            </Animated.View> */}
            {categories !== "" &&
                <Text style={tw`font-normal text-purple-600 m-0 px-1`}>
                    #{categories}
                </Text>
            }
        </Pressable>
    )
}

export default FeedItem;