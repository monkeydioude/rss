import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "@react-native-material/core";
import React, { useRef, useState } from "react";
import { Keyboard, NativeSyntheticEvent, Pressable, TextInputSubmitEditingEventData, View } from "react-native";
import { useChannelsList } from "src/global_states/channels";
import { useChannels } from "src/hooks/useChannels";
import { clean_url } from "src/services/normalization/url";
import { add_feed_source } from "src/services/request/panya";
import tw from 'twrnc';

const AddFeedInput = (): JSX.Element => {
    const [text, setText] = useState<string>("");
    // const dispatch = useDispatch();
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
    
    const onSubmit = async (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        try {
            event.persist();
            const url = clean_url(event.nativeEvent.text);
            if (channels.any(({ value: channel }): boolean => channel.channel_name == url)) {
                return;
            }
            const channel = await add_feed_source(url);
            if (channel !== null) {
                pushChannel([channel.channel_id, channel]);
            }
        } catch (err) {
            console.error("AddFeedInput: onSubmit:", err);
        } finally {
            setText("");
            Keyboard.dismiss();
        }
    };

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
                placeholder='ADD A NEW FEED URL (https://)'
                style={tw`grow border-gray-900 `}
            />
        </View>
    );
}
    
export default AddFeedInput;