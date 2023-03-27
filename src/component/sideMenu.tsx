import { Button } from '@react-native-material/core';
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { MenuProps } from '../context/menuContext';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import AddStaticFeedButton from './addStaticFeedButton';
import config from '../../config';
import { FeedsContext } from '../context/feedsContext';
import AddFeedInput from './addFeedInput';
import { clearAllData } from '../service/data_storage';
import { Provider, newProviderDataCollection } from '../data_struct';
import { MenuSectionTitle, MenuSettingsTitle, MenuFeedsSectionTitle } from './menuSectionTitle';
import { EventsContext } from '../context/eventsContext';
import CheckButton from './checkButton';
import { providersChangeSub } from '../service/handleProviders';
import tw from 'twrnc';
import { reloadFeeds } from '../feed_builder';
import Swipe, { Directions, Distance } from './swipe';
import { ChannelTitle } from './appSettings';

const getSubscriptions = async (): Promise<Provider[]> => {
    try {
        return Array.from((await newProviderDataCollection().update()).getStack().values());
    } catch (e) {
        // @todo: warning/error msg in app
        console.error(e);
    }
}

export default ({ toggleMenu }: MenuProps): JSX.Element => {
    const { setFeeds } = useContext(FeedsContext);
    const { onEvent } = useContext(EventsContext);
    const [ subscriptions, setSubscriptions ] = useState<Provider[]>([]);

    const reloadSub = async () => setSubscriptions(await getSubscriptions());

    useEffect(() => {
        const s = onEvent(
            config.events.set_feeds,
            reloadSub
        );
        reloadSub();
    }, []);
    return (
        <Swipe
            direction={Directions.Left}
            distance={Distance.Short}
            onSwipe={toggleMenu}>
            <View style={tw`w-full h-full`}>
                <Button
                    title="Close Settings"
                    onPress={toggleMenu}
                    leading={props => <Icon name="close" {...props} />} />
                <AddFeedInput setFeeds={setFeeds} />
                <View style={tw`justify-center`}>
                    <MenuSectionTitle label='Feeds Subscription' />
                    {subscriptions.map((sub: Provider, idx: number) => (
                        <CheckButton
                            key={idx}
                            title={sub.url}
                            checked={sub.subscribed}
                            onPress={async (isChecked) => {
                                await providersChangeSub(sub.url, isChecked);
                                await reloadFeeds(setFeeds)
                            }} />
                    ))}
                </View>
                <View>
                    <MenuFeedsSectionTitle label='Recommended Feeds' />
                    {config.recommendedFeeds.map((rf, idx) => (
                        <AddStaticFeedButton
                            key={idx}
                            {...rf}
                            setFeeds={setFeeds} />
                    ))}
                </View>
                <View>
                    <MenuSettingsTitle label='App Settings' />
                    <ChannelTitle />
                    <Button
                        title="Erase All Local Data"
                        onPress={async () => {
                            await clearAllData();
                            setFeeds([]);
                        }}
                        variant='outlined'
                        color="red"
                        leading={props => <Icon name="delete-alert" {...props} />} />
                </View>
            </View>
        </Swipe>
    );
}