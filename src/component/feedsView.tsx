import { Divider, Stack } from '@react-native-material/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import config from '../../config';
import { ConfigContext } from '../context/configContext';
import { FeedsContext } from '../context/feedsContext';
import { RSSItem } from '../data_struct'
import { getUnsubbedProvidersFeeds, loadAndUpdateFeeds } from '../feed_builder';
import FeedItem from './feedItem';

type Props = {
    feeds: RSSItem[],
}

export default ({ feeds }: Props): JSX.Element => {
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const { setFeeds } = useContext(FeedsContext);
    const { loadConfig } = useContext(ConfigContext);

    useEffect(() => {
        (async () => {
            try {
                // start app boot routine.
                loadConfig();
                setFeeds(await getUnsubbedProvidersFeeds());
                loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]));
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
        <View style={{flex: 1}}>
            <ScrollView
                scrollEnabled={true}
                nestedScrollEnabled={true}
                onTouchStart={(e) => {
                    e.preventDefault();
                    return
                }}
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