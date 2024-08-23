import React from 'react';
import { Alert, Button } from 'react-native';
import { setChannels, useDispatch as useChannelsDispatch } from 'src/global_states/channels';
import { setFeed, useDispatch as useFeedDispatch } from 'src/global_states/feed';
import { Mapp } from 'src/storages';
import { clearAllData } from 'src/storages/storage';

const DoomsDayButton = (): JSX.Element => {
    const feedDispatch = useFeedDispatch();
    const channelsDispatch = useChannelsDispatch();

    return (
        <Button
        title="Erase All Local Data"
        onPress={() => {
            Alert.alert("Erase all local data", "Really?", [
                {
                    text: "Ok",
                    onPress: async () => {
                        await clearAllData();
                        channelsDispatch(setChannels(new Mapp()));
                        feedDispatch(setFeed([]));
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