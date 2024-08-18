import React from 'react';
import { View } from 'react-native';
import FeedItemsFilters from 'src/components/feedItemsFilters';
import FeedsView from 'src/components/feedsView';
import Cookie from 'src/components/loading/cookie';
import { useIsBooted } from 'src/stores/boot';
import tw from 'src/style/twrnc';

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