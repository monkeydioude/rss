import React, { useContext } from "react";
import { SetFeedsCB } from "../../context/feedsContext";
import { View } from "react-native";
import { MenuSettingsTitle } from "../menuSectionTitle";
import ChannelTitle  from "../settings/channelTitle";
import { Button } from '@react-native-material/core';
import { clearAllData } from "../../service/data_storage";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LocalDataView from "./localDataView";
import MaxItemPerFeed from "../settings/maxItemPerFeed";
import { ConfigContext } from "../../context/configContext";
import { reloadFeeds } from "../../feed_builder";
import config from "../../service/config";

type Props = {
    setFeeds: SetFeedsCB,
}

const AppSettings = ({ setFeeds }: Props): JSX.Element => {
    const { setConfig } = useContext(ConfigContext);

    return (
        <View>
            <MenuSettingsTitle label='App Settings' />
            <ChannelTitle />
            <MaxItemPerFeed
                value={config.props.maxItemPerFeed}
                onValueChange={(maxItemPerFeed: number) => {
                    setConfig({maxItemPerFeed});
                    reloadFeeds(setFeeds);
                }} />
            <Button
                style={{zIndex: -1}}
                title="Erase All Local Data"
                onPress={async () => {
                    await clearAllData();
                    setFeeds([]);
                }}
                variant='outlined'
                color="red"
                leading={props => <Icon name="delete-alert" {...props} />} />
            <LocalDataView />
        </View>
    )
}

export default AppSettings;