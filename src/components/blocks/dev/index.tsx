import { router } from "expo-router";
import React from "react";
import { Button, View } from "react-native";
import tw from "src/style/twrnc";
import AddFeedSources from "./addFeedSources";
import DoomsDayButtons from "./doomsDayButton";
import LocalDataView from "./localDataView";

export const DevMenu = (): React.ReactNode => {
    return (
        <View style={tw`flex`}>
            <Button
                title="Channels"
                color="green"
                onPress={() => router.push("/dev/dev_channels")} />
            <LocalDataView />
        </View>
    )
}


export {
    AddFeedSources,
    DoomsDayButtons,
    LocalDataView
};
