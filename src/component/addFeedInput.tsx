import { TextInput } from "@react-native-material/core";
import React, { useContext, useRef, useState } from "react"
import { Keyboard, NativeSyntheticEvent, Pressable, TextInputSubmitEditingEventData, View } from "react-native";
// import { RSSItem } from "../data_struct";
import { add_feed_source } from "../feed_builder";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import tw from 'twrnc';
// import { FeedsContext } from "src/context/feedsContext";
import { addChannel, useDispatch } from "src/store/channels";

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
          const channel_id = await add_feed_source(event.nativeEvent.text);
          console.log(channel_id)
          if (channel_id !== null) {
            dispatch(addChannel(channel_id));
          }
          // addFeed(event.nativeEvent.text, (f: RSSItem[]) => setFeeds([...f]));
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
        trailing={text != "" && trailing.current}
        nativeID='add_feed'
        placeholder='ADD NEW FEED SOURCE (https://)'
        style={tw`grow border-gray-900`}
        />
    </View>
  )
}

export default AddFeedInput;