// import { Button } from "@react-native-material/core"
import React from "react"
import { Button, View } from "react-native"

type Props = {
  url: string,
  title: string,
}

const AddStaticFeedButton = ({ title, url }: Props): JSX.Element => (
  <View>
    <Button
      title={title}
      // onPress={async () => addFeed(url, (f: RSSItem[]) => setFeeds([...f]))}
    />
  </View>
)

export default AddStaticFeedButton;