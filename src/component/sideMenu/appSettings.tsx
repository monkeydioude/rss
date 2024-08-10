import React, { useContext } from "react";
import { SetFeedsCB } from "../../context/feedsContext";
import { MenuSettingsTitle } from "../menuSectionTitle";
import ChannelTitle from "../settings/channelTitle";
import MaxItemPerFeed from "../settings/maxItemPerFeed";
import { ConfigContext } from "../../context/configContext";
// import { reloadFeeds } from "../../feed_builder";
import config from "../../service/config";
import tw from 'twrnc';
import appConfig from "../../appConfig";
import DisplayCategories from "../settings/displayCategories";
import { Text, View } from "react-native";

type Props = {
    setFeeds: SetFeedsCB,
}

const AppSettings = ({ setFeeds }: Props): JSX.Element => {
    const { setConfig } = useContext(ConfigContext);

    return (
        <>
            <View style={tw`flex justify-center pb-1`}>
                <MenuSettingsTitle label='App Settings' textStyle={tw`text-2xl underline`} iconStyle={tw`text-xl`}/>
                <ChannelTitle />
                <DisplayCategories />
                <MaxItemPerFeed
                    value={config.props.maxItemPerFeed}
                    onValueChange={(maxItemPerFeed: number) => {
                        setConfig({ maxItemPerFeed });
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