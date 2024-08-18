import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, View } from 'react-native';
// import tw from 'twrnc';
import config, { isDev } from 'src/appConfig';
import AddFeedInput from 'src/components/addFeedInput';
import AppSettings from 'src/components/sideMenu/appSettings';
import ChannelsSubscriptions from 'src/components/sideMenu/channelsSubscriptions';
import DoomsDayButton from 'src/components/sideMenu/doomsDayButton';
import LocalDataView from 'src/components/sideMenu/localDataView';
import { EventsContext } from 'src/context/eventsContext';
import { FeedsContext } from 'src/context/feedsContext';
import { Provider, newProviderDataCollection } from 'src/data_struct';
import { log } from 'src/services/logchest';
import tw from 'src/style/twrnc';

const getSubscriptions = async (): Promise<Provider[]> => {
    try {
        const res = Array.from((await newProviderDataCollection().update()).getStack().values());
        return res;
    } catch (e) {
        // @todo: warning/error msg in app
        log("" + e);
        console.error(e);
    }
    return [];
}

const Settings = (): JSX.Element => {
    const { setFeeds } = useContext(FeedsContext);
    const { onEvent } = useContext(EventsContext);
    const [subscriptions, setSubscriptions] = useState<Provider[]>([]);
    const reloadSub = async () => setSubscriptions(await getSubscriptions());
    let { height } = Dimensions.get("window");
    height += StatusBar.currentHeight || 0;

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
        <View style={{ ...tw`flex flex-col grow-1 bg-primaryColor`, height}}>
            <AddFeedInput />
            <View style={{ flex: 1, margin: 0, padding: 0 }}>
                <ScrollView
                    style={{ ...tw`flex flex-col m-0 p-0 bg-purple-600 shrink-1` }}
                    scrollEnabled={true}>
                    <View
                        style={tw`w-full h-full flex flex-col pb-12`}
                    // onTouchStart={() => Keyboard.dismiss()}
                    >
                        <ChannelsSubscriptions subscriptions={subscriptions} />
                        {/* <RecommendedFeeds setFeeds={setFeeds} /> */}
                        <AppSettings setFeeds={setFeeds} />
                        {isDev() && <>
                            <LocalDataView />
                            <DoomsDayButton />
                        </>
                       }
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default Settings