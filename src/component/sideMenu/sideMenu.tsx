import { Button } from '@react-native-material/core';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Keyboard, ScrollView, StatusBar, View } from 'react-native';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import config from '../../../config';
import { FeedsContext } from '../../context/feedsContext';
import AddFeedInput from '../addFeedInput';
import { Provider, newProviderDataCollection, RSSItem } from '../../data_struct';
import { EventsContext } from '../../context/eventsContext';
import tw from 'twrnc';
import { Config, ConfigContext } from '../../context/configContext';
import ChannelsSubscriptions from './channelsSubscriptions';
import RecommendedFeeds from './recommendedFeeds';
import AppSettings from './appSettings';

const getSubscriptions = async (): Promise<Provider[]> => {
    try {
        return Array.from((await newProviderDataCollection().update()).getStack().values());
    } catch (e) {
        // @todo: warning/error msg in app
        console.error(e);
    }
}

type Props = {
    closeMenu: () => void;
}

export default ({ closeMenu }: Props): JSX.Element => {
    const { setFeeds } = useContext(FeedsContext);
    const { onEvent } = useContext(EventsContext);
    const { onConfigChange } = useContext(ConfigContext);
    const [ subscriptions, setSubscriptions ] = useState<Provider[]>([]);

    const reloadSub = async () => setSubscriptions(await getSubscriptions());
    let { height } = Dimensions.get("window");
    height += StatusBar.currentHeight;
    
    useEffect(() => {
        const [ unsub ] = onEvent(
            config.events.set_feeds,
            reloadSub
        );
        reloadSub();
        const [ unsubConfig ] = onConfigChange((config: Config) => {
            
        })
        return () => {
            unsub();
            unsubConfig();
        }
    }, []);

    return (
        <View style={{height, overflow: "visible"}}>
            <ScrollView
                style={{...tw`m-0 p-0 bg-purple-700 h-full`}}
                scrollEnabled={true}>
                <View style={tw`w-full h-full flex flex-col overflow-visible pb-12`} onTouchStart={() => Keyboard.dismiss()}>
                    <Button
                        title="Close Settings"
                        onPress={closeMenu}
                        leading={props => <Icon name="close" {...props} />} />
                    <AddFeedInput setFeeds={setFeeds} />
                    <ChannelsSubscriptions subscriptions={subscriptions} setFeeds={setFeeds} />
                    <RecommendedFeeds setFeeds={setFeeds} />
                    <AppSettings setFeeds={setFeeds} />
                </View>
            </ScrollView>
        </View>
    );
}