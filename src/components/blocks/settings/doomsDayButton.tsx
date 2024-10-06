import React from 'react';
import { Alert, Button } from 'react-native';
import { setChannels, useDispatch as useChannelsListDispatch } from 'src/global_states/channels';
import { setFeed, useDispatch as useFeedDispatch } from 'src/global_states/feed';
import { setToken, useDispatch as useAuthDispatch } from 'src/services/identity/state';
import { Mapp } from 'src/services/map/mapp';
import { TokenStorage } from 'src/storages/custom/token_storage';
import { clearAllData } from 'src/storages/storage';

const DoomsDayButtons = (): JSX.Element => {
    const feedDispatch = useFeedDispatch();
    const channelsDispatch = useChannelsListDispatch();
    const authDispatch = useAuthDispatch();

    return (
        <>
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
            <Button
                title="Erase Token"
                onPress={async () => {
                    await TokenStorage.clear();
                    authDispatch(setToken(null));
                }}
                color="red" />
        </>
    )
}

export default DoomsDayButtons;