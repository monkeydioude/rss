import { ActivityIndicator, Divider, Stack } from '@react-native-material/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import config from '../../config';
import { ConfigContext } from '../context/configContext';
import { FeedsContext } from '../context/feedsContext';
import { RSSItem } from '../data_struct'
import { getUnsubbedProvidersFeeds, loadAndUpdateFeeds } from '../feed_builder';
import FeedItem from './feedItem';
import tw from 'twrnc';
import { EventsContext } from '../context/eventsContext';

type Props = {
    feeds: RSSItem[],
}

export default ({ feeds }: Props): JSX.Element => {
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const { setFeeds } = useContext(FeedsContext);
    const { loadConfig } = useContext(ConfigContext);
    const { onEvent } = useContext(EventsContext);
    const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                // start app boot routine.
                loadConfig();
                setFeeds(await getUnsubbedProvidersFeeds());
                loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]), config.bootFetchRequestTimeout);
                setInterval(() => {
                    loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]));
                }, config.feedsRefreshTimer);
                // end app boot routine.
            } catch (e) {
                // @todo: warning/error msg in app
                console.error(e);
            }
        })();
    }, []);
    

    return (
        <View style={{flex: 1, margin: 0, padding: 0}}>
            <ScrollView
                style={tw`m-0 p-0`}
                scrollEnabled={scrollEnabled}
                canCancelContentTouches={false}
                onTouchCancel={() => {return scrollEnabled}}
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
                    <View key={idx}>
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