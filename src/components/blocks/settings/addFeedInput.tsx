import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "@react-native-material/core";
import React, { useRef, useState } from "react";
import { Keyboard, NativeSyntheticEvent, Pressable, TextInputSubmitEditingEventData, View } from "react-native";
import { addChannel, useDispatch } from "src/global_states/channels";
import { add_feed_source } from "src/services/feed_builder";
import tw from 'twrnc';

const AddFeedInput = (): JSX.Element => {
    const [text, setText] = useState<string>("");
    const dispatch = useDispatch()
    
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
        
    return (
        <View>
            <TextInput
                onSubmitEditing={async (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
                    event.persist();
                    const channel = await add_feed_source(event.nativeEvent.text);
                    if (channel!== null) {
                        dispatch(addChannel([channel.channel_id, channel]));
                    }
                    setText("");
                    Keyboard.dismiss();
                }}
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
                style={tw`grow border-gray-900`}
            />
        </View>
    );
}
    
export default AddFeedInput;