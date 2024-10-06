import React, { RefObject, useCallback } from "react";
import { View } from "react-native";
import CheckButton from "src/components/ui/checkButton";

// import { addFeed, reloadFeeds } from "../../feed_builder";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { SettingModalHandle } from "src/components/modals/SettingModal";
import { Channel } from "src/entity/channel";
import { useChannelsList } from "src/global_states/channels";
import { useChannels } from "src/hooks/useChannels";
import { log } from "src/services/request/logchest";
import tw from 'twrnc';

interface ChannelSubscriptionsProps {
    modalRef: RefObject<SettingModalHandle>,
    channelUpdater: (channel: Channel) => void,
}

interface ChannelSubProps extends ChannelSubscriptionsProps {
    channel: Channel,
    channel_id: number,
}

const ChannelSub = ({ channel, modalRef, channelUpdater }: ChannelSubProps): JSX.Element => {
    const { setSub } = useChannels();

    const onCheckButtonPress = useCallback(() => {
        try {
            channelUpdater(channel)
            modalRef?.current?.present();
        } catch (e) {
            // @todo: warning/error msg in app
            log("" + e);
            console.error(e);
        }
    }, [channel, modalRef.current]);

    return (
        <View style={{
            ...tw`mb-1`,
            zIndex: -1,
            elevation: -1
        }}>
            <CheckButton
                textStyle={tw`text-lg`}
                title={channel.channel_name}
                checked={channel.is_sub}
                trailing={<Icon name="chevron-double-right" style={tw`text-3xl text-white`} />}
                onLongPress={() => {
                    try {
                        channel.is_sub = !channel.is_sub;
                        setSub(channel.channel_id, channel.is_sub);
                        channelUpdater({ ...channel })
                    } catch (err) {
                        log("" + err);
                        console.error(err);
                    }
                }}
                onPress={() => onCheckButtonPress()}
            />
        </View>
    )
}

const ChannelsSubscriptions = ({ modalRef, channelUpdater }: ChannelSubscriptionsProps): React.ReactNode => {
    const channels = useChannelsList();
    return (
        <View style={{
            ...tw`justify-center flex flex-col`,
        }}>
            {channels.map(([channel_id, channel]) => {
                return (
                    <ChannelSub channelUpdater={channelUpdater} key={channel_id} channel={channel} channel_id={channel_id} modalRef={modalRef} />
                )
            })}
        </View>
    )
}

export default ChannelsSubscriptions