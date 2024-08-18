import React, { useRef, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import Animated, {
  useAnimatedRef
} from 'react-native-reanimated';
import { BackToTop, BackToTopButtonHandle } from 'src/components/animations/buttons/BackToTop';
import { useFeed } from 'src/stores/feed';
import tw from 'src/style/twrnc';
import FeedItem from './feedItem';

const FeedsView = (): JSX.Element => {
    const [ refreshing, setRefreshing ] = useState<boolean>(false);
    const feeds = useFeed();
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

export default FeedsView;