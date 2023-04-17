import { ActivityIndicator, Stack } from '@react-native-material/core';
import React, { useContext, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { FeedsContext } from '../context/feedsContext';
import { RSSItem } from '../data_struct';
import { loadAndUpdateFeeds } from '../feed_builder';
import FeedItem from './feedItem';
import tw from 'twrnc';

type Props = {
    feeds: RSSItem[],
}

const FeedsView = ({ feeds }: Props): JSX.Element => {
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const { setFeeds } = useContext(FeedsContext);

    return (
        <View style={{flex: 1, margin: 0, padding: 0}}>
            {feeds.length === 0 && 
                <View>
                    <ActivityIndicator size="large" color="#000000" />
                </View>
            }
            <FlatList 
                data={feeds}
                keyExtractor={(_, index) => ""+index}
                canCancelContentTouches={false}
                style={tw`m-0 p-0`}
                scrollEnabled={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true);
                            await loadAndUpdateFeeds(setFeeds);
                            setRefreshing(false);
                        }} />
                } className='h-full'
                renderItem={({item, index}): JSX.Element => (
                    <View key={item.title} style={tw`m-0 p-0`}>
                        <FeedItem item={item} it={index} />
                    </View>
                )}
            />
        </View>
    )
}

export default FeedsView;