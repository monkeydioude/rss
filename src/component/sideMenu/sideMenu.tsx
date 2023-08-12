import { Button } from '@react-native-material/core';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, View } from 'react-native';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import config from '../../../appConfig';
import { FeedsContext } from '../../context/feedsContext';
import AddFeedInput from '../addFeedInput';
import { Provider, newProviderDataCollection } from '../../data_struct';
import { EventsContext } from '../../context/eventsContext';
import tw from 'twrnc';
import ChannelsSubscriptions from './channelsSubscriptions';
import AppSettings from './appSettings';
import { log } from '../../service/logchest';
import appConfig from '../../../appConfig';
import style from '../../style/style';

const getSubscriptions = async (): Promise<Provider[]> => {
    try {
        return Array.from((await newProviderDataCollection().update()).getStack().values());
    } catch (e) {
        // @todo: warning/error msg in app
        log("" + e);
        console.error(e);
    }
}

type Props = {
    closeMenu: () => void;
}

export default ({ closeMenu }: Props): JSX.Element => {
    const { setFeeds } = useContext(FeedsContext);
    const { onEvent } = useContext(EventsContext);
    const [subscriptions, setSubscriptions] = useState<Provider[]>([]);
    const reloadSub = async () => setSubscriptions(await getSubscriptions());
    let { height } = Dimensions.get("window");
    height += StatusBar.currentHeight;

    useEffect(() => {
        const [unsub] = onEvent(
            config.events.set_feeds,
            reloadSub
        );

        reloadSub();
        return () => {
            unsub();
        }
    }, []);

    return (
        <View style={{ ...tw`flex flex-col grow-1 bg-purple-600`, maxHeight: height }}>
            <Button
                title="Close Settings"
                color={style.primaryColorDark}
                onPress={closeMenu}
                leading={props => <Icon name="close" {...props} />} />
            <AddFeedInput setFeeds={setFeeds} />
            <View style={{ flex: 1, margin: 0, padding: 0 }}>
                <ScrollView
                    style={{ ...tw`flex flex-col m-0 p-0 bg-purple-600 shrink-1` }}
                    scrollEnabled={true}>
                    <View
                        style={tw`w-full h-full flex flex-col pb-12`}
                    // onTouchStart={() => Keyboard.dismiss()}
                    >
                        <ChannelsSubscriptions subscriptions={subscriptions} setFeeds={setFeeds} />
                        {/* <RecommendedFeeds setFeeds={setFeeds} /> */}
                        <AppSettings setFeeds={setFeeds} />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}