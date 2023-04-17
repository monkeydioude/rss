import { ActivityIndicator, Divider, Stack } from '@react-native-material/core'
import React, { useContext, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { FeedsContext } from '../context/feedsContext';
import { RSSItem } from '../data_struct'
import { loadAndUpdateFeeds } from '../feed_builder';
import FeedItem from './feedItem';
import tw from 'twrnc';

type Props = {
    feeds: RSSItem[],
}

export default ({ feeds }: Props): JSX.Element => {
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const { setFeeds } = useContext(FeedsContext);

    return (
        <View style={{flex: 1, margin: 0, padding: 0}}>
            <ScrollView
                style={tw`m-0 p-0`}
                scrollEnabled={true}
                canCancelContentTouches={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true);
                            await loadAndUpdateFeeds(setFeeds);
                            setRefreshing(false);
                        }} />
                } className='h-full'>
                <Stack fill spacing={2}>
                    {feeds.length === 0 && 
                    <View>
                        <ActivityIndicator size="large" color="#000000" />
                    </View>
                    }
                    {feeds.map((item: RSSItem, idx: number): JSX.Element => (
                    <View key={item.title}>
                    {idx > 0 && 
                        <Divider style={tw`m-0 mb-1`} />
                    }
                        <FeedItem item={item} it={idx} />
                    </View>
                    ))}
                </Stack>
            </ScrollView>
        </View>
    )
}