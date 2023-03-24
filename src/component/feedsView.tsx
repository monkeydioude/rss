import { Divider, Stack } from '@react-native-material/core'
import React, { useContext, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { FeedsContext } from '../context/feedsContext';
import { RSSItem } from '../data_struct'
import { loadAndUpdateFeeds } from '../feed_builder';
import FeedItem from './feedItem';

type Props = {
  feeds: RSSItem[],
}

export default ({ feeds }: Props): JSX.Element => {
  const [ refreshing, setRefreshing ] = useState<boolean>(false);
  const { setFeeds } = useContext(FeedsContext);

  return (
    <View style={{flex: 1}}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadAndUpdateFeeds(setFeeds);
            setRefreshing(false);
          }} />
      } className='h-full'>
        <Stack fill spacing={2}>
          {feeds.map((item: RSSItem, idx: number): JSX.Element => (
            <View key={idx}>
              {idx > 0 && 
                <Divider />
              }
              <FeedItem item={item} />
            </View>
          ))}
        </Stack>
      </ScrollView>
    </View>
  )
}