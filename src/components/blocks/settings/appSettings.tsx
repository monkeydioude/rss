import React from "react";
import { MenuSettingsTitle } from "src/components/ui/menuSectionTitle";
// import { reloadFeeds } from "../../feed_builder";
import { Text, View } from "react-native";
import appConfig from "src/appConfig";
import { ChannelTitle, DisplayCategories, MaxItemPerFeed } from "src/components/ui/settings";
import { useConfig } from "src/global_states/config";
import tw from 'twrnc';


const AppSettings = (): JSX.Element => {
    const config = useConfig();
    return (
        <>
            <View style={tw`flex justify-center pb-1`}>
                <MenuSettingsTitle label='App Settings' textStyle={tw`text-2xl underline`} iconStyle={tw`text-xl`}/>
                <ChannelTitle />
                <DisplayCategories />
                <MaxItemPerFeed
                    value={config.maxItemPerFeed}
                    onValueChange={(maxItemPerFeed: number) => {
                        // setConfig({ maxItemPerFeed });
                        // reloadFeeds(setFeeds);
                    }} />
            </View>
            <View style={tw`flex flex-row justify-end pr-2 w-93`}>
                <Text style={tw`text-lg text-white`}>{appConfig.appVersion}</Text>
            </View>
        </>
    )
}

export default AppSettings;