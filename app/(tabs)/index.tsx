import React, { useRef, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import Animated, {
    useAnimatedRef
} from 'react-native-reanimated';
import FeedItem from 'src/components/blocks/feed/feedItem';
import FeedItemsFilters from 'src/components/blocks/feed/feedItemsFilters';
import Cookie from 'src/components/loading/cookie';
import { BackToTop, BackToTopButtonHandle } from 'src/components/ui/animations/buttons/BackToTop';
import { useIsBooted } from 'src/global_states/boot';
import { useGetFeed } from 'src/global_states/feed';
import tw from 'src/style/twrnc';

const FeedsView = (): JSX.Element => {
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const feeds = useGetFeed();
    const flatListRef = useAnimatedRef<Animated.FlatList<any>>();
    // const scrollHandler = useScrollViewOffset(scrollRef);

    const bttRef = useRef<BackToTopButtonHandle>(null)
    
    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        bttRef.current?.handleScroll(scrollPosition);
    };

    return (
        <View style={tw`flex-1 m-0 p-0`}>
            <Animated.FlatList 
                data={feeds}
                ref={flatListRef}
                keyExtractor={(_, index) => "" + index}
                keyboardDismissMode='on-drag'
                canCancelContentTouches={false}
                scrollEnabled={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true);
                            // await loadAndUpdateFeeds(setFeeds);
                            setRefreshing(false);
                        }} />
                } 
                renderItem={({item, index}): JSX.Element => (
                    <View key={item.title} style={tw`m-0 p-0`}>
                        <FeedItem item={item} it={index} />
                    </View>
                )}
            />
            <BackToTop ref={bttRef} linkRef={flatListRef} />
        </View>
    )
}

const Feed = (): JSX.Element => {
  const isBooted = useIsBooted();

    return (
      <View style={{ ...tw`flex-1` }}>
            <FeedItemsFilters />
            {isBooted ? 
                <FeedsView/> :
                <Cookie />
            }
        </View>
    );
}

export default Feed;