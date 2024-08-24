import React from 'react';
import { Dimensions, ScrollView, StatusBar, View } from 'react-native';
// import tw from 'twrnc';
import { isDev } from 'src/appConfig';
import { AddFeedInput, AppSettings, ChannelsSubscriptions, DoomsDayButton, LocalDataView } from 'src/components/blocks/settings';
import tw from 'src/style/twrnc';

const Settings = (): JSX.Element => {
    let { height } = Dimensions.get("window");
    height += StatusBar.currentHeight || 0;

    return (
        <View style={{ ...tw`flex flex-col grow-1 bg-primaryColor`, height}}>
            <AddFeedInput />
            <View style={{ flex: 1, margin: 0, padding: 0 }}>
                <ScrollView
                    style={{ ...tw`flex flex-col m-0 p-0 bg-purple-600 shrink-1` }}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}>
                    <View
                        style={tw`w-full h-full flex flex-col pb-12`}
                    // onTouchStart={() => Keyboard.dismiss()}
                    >
                        <ChannelsSubscriptions />
                        {/* <RecommendedFeeds setFeeds={setFeeds} /> */}
                        <AppSettings />
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