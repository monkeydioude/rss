import React, { useContext, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { FeedsContext } from '../context/feedsContext';
// import { RSSItem } from '../data_struct';
// import { loadAndUpdateFeeds } from '../feed_builder';
import FeedItem from './feedItem';
import tw from 'twrnc';
import { emojiDispenser } from '../service/emoji_dispenser';
import { Item } from 'src/entity/item';
import { useFeed } from 'src/store/feed';

type Props = {
    feeds: Item[],
}

const FeedsView = (): JSX.Element => {
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const { setFeeds, hasFilters } = useContext(FeedsContext);

    const feeds = useFeed();

    return (
        <View style={{flex: 1, margin: 0, padding: 0}}>
            {/* {feeds.length === 0 && !hasFilters() &&
                <Text style={tw`text-2xl text-center`}>No items {emojiDispenser("error")}</Text>
            }
            {feeds.length === 0 && hasFilters() &&
                <Text style={tw`text-2xl text-center`}>No items {emojiDispenser("not_found")}</Text>
            } */}
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
                            // await loadAndUpdateFeeds(setFeeds);
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