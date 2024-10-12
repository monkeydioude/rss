import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "@react-native-material/core";
import React, { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { addFeedFilter, addFeedFilterMatch, resetFeedFilters, useDispatch } from "src/global_states/feed";
import i18n from "src/i18n";
import { textFilter } from "src/services/feed/filter";
import tw from 'twrnc';

const FeedItemsFilters = (): JSX.Element => {
    const [text, setText] = useState<string>("");
    const dispatch = useDispatch();

    return (
        <View>
            <TextInput
                inputStyle={tw`text-lg`}
                onSubmitEditing={async () => {
                    dispatch(addFeedFilterMatch(text));
                    dispatch(addFeedFilter(textFilter));
                    Keyboard.dismiss();
                }}
                onChangeText={(_text: string) => {
                    setText(_text);
                }}
                value={text}
                leading={<Icon style={{
                    ...tw`text-3xl`,
                    marginTop: -7,
                    marginLeft: -2
                }} name="magnify" />}
                trailing={text != "" && (
                    <View style={tw`flex items-center`}>
                        <Pressable onPress={async () => {
                            setText("");
                            dispatch(resetFeedFilters());
                        }}>
                            <Icon style={{
                                ...tw`text-3xl`,
                                marginTop: -7,
                                marginLeft: -2
                            }} name="close" />
                        </Pressable>
                    </View>
                )}
                nativeID='filter_text'
                placeholder={i18n.en.FEED_ITEM_FILTER_PLACEHOLDER}
                className="border-gray-900 grow"
            />
        </View>
    )
}

export default FeedItemsFilters;