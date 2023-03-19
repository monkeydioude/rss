import { TextInput } from "@react-native-material/core";
import React from "react"
import { NativeSyntheticEvent, TextInputSubmitEditingEventData, View } from "react-native";
import { RSSItem } from "../data_struct";
import { addFeed } from "../feed_builder";

type TextSubmitEvent = NativeSyntheticEvent<TextInputSubmitEditingEventData>;

type Props = {
  setFeeds: (f: React.SetStateAction<RSSItem[]>) => void,
}

export default ({ setFeeds }: Props): JSX.Element => (
  <View>
    <TextInput
    onSubmitEditing={async (event: TextSubmitEvent) => {
      event.persist();
      addFeed(event.nativeEvent.text.toLocaleLowerCase(), (f: RSSItem[]) => setFeeds([...f]));
    }}
    nativeID='add_feed'
    placeholder='Add feed'
    className="border-gray-900" />
  </View>
)