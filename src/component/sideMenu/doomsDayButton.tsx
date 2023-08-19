import { clearAllData } from '../../service/data_storage';
import { Button } from '@react-native-material/core';
import { Alert } from 'react-native';
import React, { useContext } from 'react';
import { FeedsContext } from '../../context/feedsContext';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const DoomsDayButton = (): JSX.Element => {
    const { setFeeds } = useContext(FeedsContext);
    return (
        <Button
        style={{ zIndex: -1 }}
        title="Erase All Local Data"
        onPress={() => {
            Alert.alert("Erase all local data", "Really?", [
                {
                    text: "Ok",
                    onPress: async () => {
                        await clearAllData();
                        setFeeds([]);
                    },
                    style: "destructive"
                },
                {
                    text: "Nope",
                    onPress: () => { },
                    style: "cancel"
                }
            ])
        }}
        variant='outlined'
        color="red"
        leading={props => <Icon name="delete-alert" {...props} />} />
    )
}

export default DoomsDayButton;