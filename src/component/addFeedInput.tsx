import { TextInput } from "@react-native-material/core";
import React, { useRef, useState } from "react"
import { Keyboard, NativeSyntheticEvent, Pressable, Text, TextInputSubmitEditingEventData, TextInputTextInputEventData, View } from "react-native";
import { RSSItem } from "../data_struct";
import { addFeed } from "../feed_builder";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import tw from 'twrnc';

type Props = {
  setFeeds: (f: React.SetStateAction<RSSItem[]>) => void,
}

const AddFeedInput = ({ setFeeds }: Props): JSX.Element => {
  const [ text, setText ] = useState<string>("");

  const trailing = useRef(<View>
      <Pressable onPress={() => {
        setText("");
      }}>
        <Icon style={tw`text-lg`} name="close" />
      </Pressable>
    </View>);

  return (
    <View>
      <TextInput
        onSubmitEditing={async (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
          event.persist();
          addFeed(event.nativeEvent.text.toLocaleLowerCase(), (f: RSSItem[]) => setFeeds([...f]));
          setText("");
          Keyboard.dismiss();
        }}
        onTextInput={(e: NativeSyntheticEvent<TextInputTextInputEventData>) => {
          setText(e.nativeEvent.text);
        }}
        value={text}
        leading={(
          <>
            <Icon style={tw`text-lg`} name="rss" />
          </>
        )}
        trailing={text != "" && trailing.current}
        nativeID='add_feed'
        placeholder='Add feed'
        style={tw`grow`}
        className="border-gray-900" />
    </View>
  )
}

export default AddFeedInput;