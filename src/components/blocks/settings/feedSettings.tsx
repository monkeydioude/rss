import React from "react";
import { View } from "react-native";
import { MaxItemPerFeed } from "src/components/ui/settings";
import { updateConfig, useConfig, useDispatch as useConfigDispatch } from "src/global_states/config";
import { ConfigStorage } from "src/storages/custom";
import tw from 'twrnc';
import ChannelTitle from "./channelTitle";
import DisplayCategories from "./displayCategories";

const FeedSettings = (): JSX.Element => {
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
            </View>
        </>
    )
}

export default FeedSettings;