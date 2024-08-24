import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { FeedItemFilter, FeedItemFilterRemover } from "src/context/feedsContext";
import { Item } from "src/entity/item";
import tw from 'twrnc';
import { isString } from "../../../services/type_ops";

const FeedItemsFilters = (): JSX.Element => {
    const [filterRemover, setFilterRemover] = useState<FeedItemFilterRemover|null>(null);
    const [text, setText] = useState<string>("");

    useEffect(() => {
    }, [filterRemover]);

    const textFilter: FeedItemFilter = (item: Item) => {
        let textL = text.toLowerCase();
        const res = 
            (!!item.category && isString(item.category) && !!(item.category as string).toLowerCase().match(textL)) || 
            (!!item.description && !!item.description.toLowerCase().match(textL)) ||
            (!!item.title && !!item.title.toLowerCase().match(textL));
        
        const reg = new RegExp(`(${textL})`, "gi");

        if (item.title) {
            item.title = item.title.replaceAll(reg, "**$1**");
        }
        if (item.description) {
            item.description = item.description.replaceAll(reg, "**$1**");
        }
        return res
    };

    return (
        <View>
            <TextInput
                inputStyle={tw`text-lg`}
                onSubmitEditing={async () => {
                    if (filterRemover) {
                        filterRemover();
                    }
                    // add pushFilter in Feed's global state?
                    const rmer = pushFilter(textFilter);
                    setFilterRemover(() => rmer);

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
                            if (filterRemover) {
                                filterRemover();
                            }
                            setFilterRemover(null);
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
                placeholder='FILTER BY TEXT'
                className="border-gray-900 grow"
            />
        </View>
    )
}

export default FeedItemsFilters;