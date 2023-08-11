import { TextInput } from "@react-native-material/core";
import React, { useContext, useEffect, useState } from "react"
import { Keyboard, Pressable, View } from "react-native";
import { RSSItem } from "../data_struct";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import tw from 'twrnc';
import { FeedItemFilter, FeedItemFilterRemover, FeedsContext } from "../context/feedsContext";
import { isString } from "../service/type_ops";

const FeedItemsFilters = (): JSX.Element => {
    const { pushFilter, reloadFeeds } = useContext(FeedsContext);
    const [filterRemover, setFilterRemover] = useState<FeedItemFilterRemover|null>(null);
    const [text, setText] = useState<string>("");


    useEffect(() => {
        reloadFeeds();
    }, [filterRemover]);

    const textFilter: FeedItemFilter = (item: RSSItem) => {
        let textL = text.toLowerCase();
        const res = 
            (item.category && isString(item.category) && !!(item.category as string).toLowerCase().match(textL)) || 
            (item.description && !!item.description.toLowerCase().match(textL)) ||
            (item.title && !!item.title.toLowerCase().match(textL));

        return res
    };

    return (
        <View>
            <TextInput
                onSubmitEditing={async () => {
                    if (filterRemover) {
                        filterRemover();
                    }
                    const rmer = pushFilter(textFilter);
                    setFilterRemover(() => rmer);

                    Keyboard.dismiss();
                }}
                onChangeText={(_text: string) => {
                    setText(_text);
                }}
                value={text}
                leading={<Icon style={tw`text-lg`} name="magnify" />}
                trailing={text != "" && (
                    <View>
                        <Pressable onPress={async () => {
                            setText("");
                            if (filterRemover) {
                                filterRemover();
                            }
                            setFilterRemover(null);
                        }}>
                            <Icon style={tw`text-lg`} name="close" />
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