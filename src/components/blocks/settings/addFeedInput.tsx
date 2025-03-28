import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "@react-native-material/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, NativeSyntheticEvent, Pressable, TextInputSubmitEditingEventData, View } from "react-native";
import { useChannelsList } from "src/global_states/channels";
import { useChannels } from "src/hooks/useChannels";
import i18n from "src/i18n";
import { clean_url } from "src/services/normalization/url";
import { add_feed_source } from "src/services/request/panya";
import toast from "src/services/toast";
import tw from 'twrnc';


type Props = {
    onTextChange?: (text: string) => void;
    text?: string;
    doSendChannelAdd?: (cb: (text: string) => void) => void;
}

type ChannelTuple = {
    url: string,
    name: string,
}

const AddFeedInput = ({ onTextChange, text: propsText, doSendChannelAdd }: Props): JSX.Element => {
    const [text, setText] = useState<string>(propsText || "");
    const channels = useChannelsList();
    const { push: pushChannel } = useChannels();
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
        if (doSendChannelAdd) {
            doSendChannelAdd(sendChannelAdd)
        }
    }, [doSendChannelAdd]);
    
    useEffect(() => {
        if (onTextChange) {
            onTextChange(text);
        }
    }, [text]);

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
        <View style={{
            ...tw`flex`,
        }} >
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
                // onBlur={() => setTimeout(() => setShowList(false), 200)} // Delay to allow item clicks
                // onFocus={() => setShowList(text.length > 0)}
            />
            {/* {showList && 
                <View style={{
                    top: 55,
                    backgroundColor: style.thirdColor,
                    borderColor: "#ccc",
                    zIndex: 1000,
                    ...tw`flex absolute `,
                }} >
                    <Animated.FlatList
                        style={{
                            maxHeight: suggestion.maxHeight,
                            width,
                        }}
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
            } */}
        </View>
    );
}

export default AddFeedInput;