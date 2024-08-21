// import { Button } from "@react-native-material/core"
import React from "react"
import { Button, View } from "react-native"
import { RSSItem } from "../data_struct"
import { addFeed } from "../services/feed_builder"

type Props = {
  setFeeds: (f: React.SetStateAction<RSSItem[]>) => void,
  url: string,
  title: string,
}

const AddStaticFeedButton = ({ title, url, setFeeds }: Props): JSX.Element => (
  <View>
    <Button
      title={title}
      onPress={async () => addFeed(url, (f: RSSItem[]) => setFeeds([...f]))} />
  </View>
)

export default AddStaticFeedButton;