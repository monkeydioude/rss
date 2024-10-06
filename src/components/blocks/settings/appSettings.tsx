import React from "react";
import { Text, View } from "react-native";
import appConfig, { isDev } from "src/appConfig";
import { ChannelTitle, DisplayCategories, MaxItemPerFeed } from "src/components/ui/settings";
import { updateConfig, useConfig, useDispatch as useConfigDispatch } from "src/global_states/config";
import { ConfigStorage } from "src/storages/custom";
import tw from 'twrnc';
import DoomsDayButtons from "./doomsDayButton";
import LocalDataView from "./localDataView";

const AppSettings = (): JSX.Element => {
    const config = useConfig();
    const configDispatch = useConfigDispatch();

    return (
        <>
            <View style={tw`flex justify-center pb-1`}>
                <ChannelTitle />
                <DisplayCategories />
                <MaxItemPerFeed
                    value={config.maxItemPerFeed}
                    onValueChange={(maxItemPerFeed: number) => {
                        configDispatch(updateConfig({ maxItemPerFeed }));
                        ConfigStorage.update({
                            ...config,
                            maxItemPerFeed
                        });
                    }} />
                {isDev() && (
                    <>
                        <LocalDataView />
                        <DoomsDayButtons />
                    </>
                )}
            </View>
            <View style={tw`flex flex-row justify-end pr-2 w-93`}>
                <Text style={tw`text-lg text-white`}>{appConfig.appVersion}</Text>
            </View>
        </>
    )
}

export default AppSettings;