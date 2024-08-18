import React, { useContext } from 'react';
import { Alert, Button } from 'react-native';
import { FeedsContext } from '../../context/feedsContext';
import { clearAllData } from '../../services/data_storage';

const DoomsDayButton = (): JSX.Element => {
    const { setFeeds } = useContext(FeedsContext);
    return (
        <Button
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
        color="red" />
    )
}

export default DoomsDayButton;