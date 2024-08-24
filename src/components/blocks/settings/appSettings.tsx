import React from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import appConfig from "src/appConfig";
import { MenuSettingsTitle } from "src/components/ui/menuSectionTitle";
import { ChannelTitle, DisplayCategories, MaxItemPerFeed } from "src/components/ui/settings";
import { updateConfig, useConfig, useDispatch as useConfigDispatch } from "src/global_states/config";
import useFeed from "src/hooks/useFeed";
import { ConfigStorage } from "src/storages/custom";
import tw from 'twrnc';

const AppSettings = (): JSX.Element => {
    const config = useConfig();
    const configDispatch = useConfigDispatch();
    const { reload: reloadFeed } = useFeed();

    return (
        <>
            <View style={tw`flex justify-center pb-1`}>
                <MenuSettingsTitle label='App Settings' textStyle={tw`text-2xl underline`} iconStyle={tw`text-xl`}/>
                <ChannelTitle />
                <DisplayCategories />
                <MaxItemPerFeed
                    value={config.maxItemPerFeed}
                    onValueChange={(maxItemPerFeed: number) => {
                        configDispatch(updateConfig({ maxItemPerFeed }));
                        Toast.show({
                            type: "info",
                            text1: "This setting will apply next feed reload!",
                            text2: `Max items per feed set to ${maxItemPerFeed}`
                        })
                        ConfigStorage.update({
                            ...config,
                           maxItemPerFeed
                        });
                        if (maxItemPerFeed < config.maxItemPerFeed)
                            reloadFeed();
                    }} />
            </View>
            <View style={tw`flex flex-row justify-end pr-2 w-93`}>
                <Text style={tw`text-lg text-white`}>{appConfig.appVersion}</Text>
            </View>
        </>
    )
}

export default AppSettings;