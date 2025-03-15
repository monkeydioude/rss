import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "@react-native-material/core";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, NativeSyntheticEvent, Pressable, Text, TextInputSubmitEditingEventData, TouchableOpacity, useWindowDimensions, View } from "react-native";
import appConfig from "src/appConfig";
import { useChannelsList } from "src/global_states/channels";
import { useChannels } from "src/hooks/useChannels";
import { useKeyboard } from "src/hooks/useKeyboard";
import i18n from "src/i18n";
import { clean_url } from "src/services/normalization/url";
import { log } from "src/services/request/logchest";
import { add_feed_source, get_channels } from "src/services/request/panya";
import toast from "src/services/toast";
import style from "src/style/style";
import tw from 'twrnc';


type Props = {
    onTextChange?: (text: string) => void;
    text?: string;
}

type ChannelTuple = {
    url: string,
    name: string,
}

const AddFeedInput = ({ onTextChange, text: propsText }: Props): JSX.Element => {
    const [text, setText] = useState<string>(propsText || "");
    const [showList, setShowList] = useState(text.length > 3);
    const [data, setData] = useState<ChannelTuple[]>([]);
    // const dispatch = useDispatch();
    const channels = useChannelsList();
    const { push: pushChannel } = useChannels();
    const { width, height } = useWindowDimensions();
    const { height: keyboardHeight} = useKeyboard();
    const seed = useRef<NodeJS.Timeout | null>(null);
    const trailing = useRef(<View>
        <Pressable onPress={() => {
            setText("");
        }}>
            <Icon style={{
                ...tw`text-3xl`,
                marginTop: -7,
                marginLeft: -2
            }} name="close" />
        </Pressable>
    </View>);
    
    useEffect(() => {
        setShowList(text.length >= appConfig.suggestionMinChars);
        if (onTextChange) {
            onTextChange(text);
        }
        if (text.length >= appConfig.suggestionMinChars) {
            if (seed.current != null) {
                clearTimeout(seed.current);
                seed.current = null;
            }
            seed.current = setTimeout(() => {
                get_channels(text).then((res) => {
                    // setData(res.map((el) => ({ name: el.name, url: el.url })));
                    setData(res);
                }).catch((err) => {
                    log(err);
                })
            }, appConfig.suggestionWaitingTime);
        } else {
            setData([]);
        }
    }, [text]);

    const suggestion = useMemo(() => ({ maxHeight: height - keyboardHeight - appConfig.suggestionHeaderSize }), [height, keyboardHeight]);
    // const suggestion = useAnimatedStyle(() => ({ maxHeight: height - keyboardHeight.value - appConfig.suggestionHeaderSize }));

    const sendChannelAdd = useCallback(async (url: string) => {
        try {
            if (channels.any(({ value: channel }): boolean => channel.channel_name == url)) {
                return;
            }
            const channel = await add_feed_source(url);
            if (!channel) {
                return toast.err(i18n.en.FEED_SUBSCRIPTION_ERR_1, url);
            }
            pushChannel([channel.channel_id, channel]);
            toast.ok(i18n.en.FEED_SUBSCRIPTION_SUCCESS_1, channel.channel_name);
        } catch (err) {sendChannelAdd
            console.error("AddFeedInput: sendChannelAdd:", err);
        } finally {
            setText("");
            Keyboard.dismiss();
        }
    }, [channels, pushChannel]);

    const onSubmit = useCallback(async (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        try {
            event.persist();
            const url = clean_url(event.nativeEvent.text);
            await sendChannelAdd(url);
        } catch (err) {
            console.error("AddFeedInput: onSubmit:", err);
        }
    }, []);

    return (
        <View>
            <TextInput
                onSubmitEditing={onSubmit}
                onChangeText={(text) => {
                    setText(text);
                }}
                value={text}
                leading={<Icon style={{
                    ...tw`text-3xl`,
                    marginTop: -7,
                    marginLeft: -2
                }} name="rss" />}
                autoCapitalize="none"
                trailing={text != "" && trailing.current}
                nativeID='add_feed'
                placeholder={i18n.en.FEED_INPUT_ADD_SOURCE}
                style={tw`grow border-gray-900 `}
                onBlur={() => setTimeout(() => setShowList(false), 200)} // Delay to allow item clicks
                onFocus={() => setShowList(text.length > 0)}
            />
            {showList && 
                <View style={{
                    ...{
                        top: 55,
                        backgroundColor: style.thirdColor,
                        borderColor: "#ccc",
                        maxHeight: suggestion.maxHeight,
                        zIndex: 1000,
                    },
                    ...tw`absolute border`,
                }} >
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.name}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    borderColor: style.primaryColor,
                                    ...tw`p-2 border-b`,
                                }}
                                onPress={() => {
                                    sendChannelAdd(item.url);
                                }}
                            >
                                <Text style={{
                                    width,
                                    ...tw`text-lg`,
                                }} > { item.name }</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            }
        </View>
    );
}

export default AddFeedInput;