import React from "react";
import { SetFeedsCB } from "../../context/feedsContext";
import { View } from "react-native";
import { MenuSettingsTitle } from "../menuSectionTitle";
import ChannelTitle  from "../settings/channelTitle";
import { Button } from '@react-native-material/core';
import { clearAllData } from "../../service/data_storage";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LocalDataView from "./localDataView";
import MaxItemPerFeed from "../settings/maxItemPerFeed";

type Props = {
    setFeeds: SetFeedsCB,
}

const AppSettings = ({ setFeeds }: Props): JSX.Element => {
    return (
        <View>
            <MenuSettingsTitle label='App Settings' />
            <ChannelTitle />
            <MaxItemPerFeed />
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